package services

import (
	"context"
	"fmt"
	"github.com/gofrs/uuid"
	"mime/multipart"
	"net/url"
	"os"
	"src/dal"

	"github.com/Azure/azure-storage-blob-go/azblob"
	"github.com/gin-gonic/gin"
)

type AzureProvider struct {
	containerURL azblob.ContainerURL
	maxFileSize  int64
}

var instance *AzureProvider

func GetAzureProviderInstance() (*AzureProvider, error) {
	if instance == nil {
		instance, err := newAzureProvider()
		if err != nil {
			return nil, fmt.Errorf("failed to create AzureProvider instance: %v", err)
		}
		return instance, nil
	}
	return instance, nil
}

func newAzureProvider() (*AzureProvider, error) {
	accountName := os.Getenv("AZURE_STORAGE_ACCOUNT_NAME")
	accountKey := os.Getenv("AZURE_STORAGE_ACCOUNT_KEY")
	containerName := os.Getenv("AZURE_STORAGE_CONTAINER_NAME")
	maxFileSize := 10 << 20

	if accountName == "" || accountKey == "" {
		panic("missing Azure Storage account name or key")
	}
	credential, err := azblob.NewSharedKeyCredential(accountName, accountKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create shared key credential: %v", err)
	}
	pipeline := azblob.NewPipeline(credential, azblob.PipelineOptions{})
	serviceURL := azblob.NewServiceURL(getServiceURL(accountName), pipeline)
	containerURL := serviceURL.NewContainerURL(containerName)

	return &AzureProvider{
		containerURL: containerURL,
		maxFileSize:  int64(maxFileSize),
	}, nil
}

func (ap *AzureProvider) UploadFile(ctx *gin.Context, id uuid.UUID) error {

	file, header, err := ctx.Request.FormFile("file")
	if err != nil {
		return err
	}
	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
		}
	}(file)

	if header.Size > ap.maxFileSize {
		ctx.JSON(400, gin.H{"error": fmt.Sprintf("file size exceeds the limit of %d bytes", ap.maxFileSize)})
	}

	c := context.Background()
	blobURL := ap.containerURL.NewBlockBlobURL(header.Filename)
	_, err = azblob.UploadStreamToBlockBlob(c, file, blobURL, azblob.UploadStreamToBlockBlobOptions{
		BufferSize: int(ap.maxFileSize),
	})
	if err != nil {
		return err
	}

	blobURLStr := blobURL.URL().Path

	return dal.InsertImagePathToQuestionInDb(id, blobURLStr)
}

func getServiceURL(accountName string) url.URL {
	serviceURL := url.URL{
		Scheme: "https",
		Host:   fmt.Sprintf("%s.blob.core.windows.net", accountName),
	}
	return serviceURL
}
