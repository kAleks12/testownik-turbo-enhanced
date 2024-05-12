package services

import (
	"context"
	"fmt"
	"github.com/gofrs/uuid"
	"mime/multipart"
	"net/url"
	"os"
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

func (ap *AzureProvider) UploadFile(ctx *gin.Context, testId uuid.UUID, questionId uuid.UUID, answerId *uuid.UUID,
	callback func(id uuid.UUID, path string) error) (*string, error) {
	file, header, err := ctx.Request.FormFile("file")
	if err != nil {
		return nil, err
	}
	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
		}
	}(file)

	if header.Size > ap.maxFileSize {
		return nil, fmt.Errorf("file size exceeds the limit of %d bytes", ap.maxFileSize)
	}

	c := context.Background()
	blobURL := buildFile(header, testId, questionId, answerId, ap)
	err = cleanupOldFiles(testId, questionId, answerId, ap, c)
	if err != nil {
		return nil, err
	}

	_, err = azblob.UploadStreamToBlockBlob(c, file, blobURL, azblob.UploadStreamToBlockBlobOptions{
		BufferSize: int(ap.maxFileSize),
	})
	if err != nil {
		return nil, err
	}
	finalUrl, err := buildUrlAndApplyCallback(blobURL, answerId, callback, questionId)
	if err != nil {
		return nil, err
	} else {
		return &finalUrl, nil
	}
}

func (ap *AzureProvider) UploadFileDirect(file multipart.File, filename string, testId uuid.UUID, questionId uuid.UUID,
	answerId *uuid.UUID, callback func(id uuid.UUID, path string) error) error {
	c := context.Background()
	blobURL := buildDirectFile(filename, testId, questionId, answerId, ap)
	_, err := azblob.UploadStreamToBlockBlob(c, file, blobURL, azblob.UploadStreamToBlockBlobOptions{
		BufferSize: int(ap.maxFileSize),
	})
	if err != nil {
		return err
	}

	blobURLStr := blobURL.URL().Path
	blobURLStr = os.Getenv("AZURE_SA_URL") + blobURLStr
	if answerId != nil {
		return callback(*answerId, blobURLStr)
	} else {
		return callback(questionId, blobURLStr)
	}
}

func (ap *AzureProvider) DeleteFiles(prefix string) error {
	c := context.Background()
	marker := azblob.Marker{}
	for marker.NotDone() {
		listBlob, err := ap.containerURL.ListBlobsFlatSegment(c, marker, azblob.ListBlobsSegmentOptions{
			Prefix: prefix,
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
	return nil
}

func (ap *AzureProvider) DeleteFilesCallback(prefix string, id uuid.UUID, callback func(id uuid.UUID) error) error {
	err := ap.DeleteFiles(prefix)
	if err != nil {
		return err
	}
	return callback(id)
}

func buildUrlAndApplyCallback(blobURL azblob.BlockBlobURL, answerId *uuid.UUID,
	callback func(id uuid.UUID, path string) error, questionId uuid.UUID) (string, error) {
	blobURLStr := blobURL.URL().Path
	blobURLStr = os.Getenv("AZURE_SA_URL") + blobURLStr
	if answerId != nil {
		return blobURLStr, callback(*answerId, blobURLStr)
	} else {
		return blobURLStr, callback(questionId, blobURLStr)
	}
}

func getServiceURL(accountName string) url.URL {
	serviceURL := url.URL{
		Scheme: "https",
		Host:   fmt.Sprintf("%s.blob.core.windows.net", accountName),
	}
	return serviceURL
}

func cleanupOldFiles(testId uuid.UUID, questionId uuid.UUID, answerId *uuid.UUID, ap *AzureProvider, c context.Context) error {
	prefix := testId.String() + "_" + questionId.String()
	if answerId != nil {
		prefix += "_" + answerId.String()
	}
	marker := azblob.Marker{}
	for marker.NotDone() {
		listBlob, err := ap.containerURL.ListBlobsFlatSegment(c, marker, azblob.ListBlobsSegmentOptions{
			Prefix: prefix,
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
	return nil
}

func buildFile(header *multipart.FileHeader, testId uuid.UUID, questionId uuid.UUID, answerId *uuid.UUID,
	ap *AzureProvider) azblob.BlockBlobURL {
	fileNameParts := strings.Split(header.Filename, ".")
	name := testId.String() + "_" + questionId.String()
	if answerId != nil {
		name += "_" + answerId.String()
	}
	blobURL := ap.containerURL.NewBlockBlobURL(name + "." + fileNameParts[len(fileNameParts)-1])
	return blobURL
}

func buildDirectFile(filename string, testId uuid.UUID, questionId uuid.UUID, answerId *uuid.UUID,
	ap *AzureProvider) azblob.BlockBlobURL {
	fileNameParts := strings.Split(filename, ".")
	name := testId.String() + "_" + questionId.String()
	if answerId != nil {
		name += "_" + answerId.String()
	}
	blobURL := ap.containerURL.NewBlockBlobURL(name + "." + fileNameParts[len(fileNameParts)-1])
	return blobURL
}
