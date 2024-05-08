package services

import (
	"context"
	"fmt"
	"github.com/gofrs/uuid"
	"mime/multipart"
	"net/url"
	"os"
	"src/dal"
	"strings"

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
		return fmt.Errorf("file size exceeds the limit of %d bytes", ap.maxFileSize)
	}

	c := context.Background()
	fileNameParts := strings.Split(header.Filename, ".")
	blobURL := ap.containerURL.NewBlockBlobURL(id.String() + "." + fileNameParts[len(fileNameParts)-1])

	// Delete all blobs that start with the id
	marker := azblob.Marker{}
	for marker.NotDone() {
		listBlob, err := ap.containerURL.ListBlobsFlatSegment(c, marker, azblob.ListBlobsSegmentOptions{
			Prefix: id.String(),
		})
		if err != nil {
			return err
		}
		marker = listBlob.NextMarker

		for _, blobInfo := range listBlob.Segment.BlobItems {
			blobURL := ap.containerURL.NewBlockBlobURL(blobInfo.Name)
			_, err = blobURL.Delete(c, azblob.DeleteSnapshotsOptionInclude, azblob.BlobAccessConditions{})
			if err != nil {
				return err
			}
		}
	}

	_, err = azblob.UploadStreamToBlockBlob(c, file, blobURL, azblob.UploadStreamToBlockBlobOptions{
		BufferSize: int(ap.maxFileSize),
	})
	if err != nil {
		return err
	}

	blobURLStr := blobURL.URL().Path
	blobURLStr = os.Getenv("AZURE_SA_URL") + blobURLStr
	return dal.InsertImagePathToQuestionInDb(id, blobURLStr)
}

func (ap *AzureProvider) DeleteFile(id uuid.UUID) error {
	c := context.Background()
	marker := azblob.Marker{}
	for marker.NotDone() {
		listBlob, err := ap.containerURL.ListBlobsFlatSegment(c, marker, azblob.ListBlobsSegmentOptions{
			Prefix: id.String(),
		})
		if err != nil {
			return err
		}
		marker = listBlob.NextMarker

		for _, blobInfo := range listBlob.Segment.BlobItems {
			blobURL := ap.containerURL.NewBlockBlobURL(blobInfo.Name)
			_, err = blobURL.Delete(c, azblob.DeleteSnapshotsOptionInclude, azblob.BlobAccessConditions{})
			if err != nil {
				return err
			}
		}
	}
	return dal.ClearImagePathFromQuestionInDb(id)
}

func getServiceURL(accountName string) url.URL {
	serviceURL := url.URL{
		Scheme: "https",
		Host:   fmt.Sprintf("%s.blob.core.windows.net", accountName),
	}
	return serviceURL
}
