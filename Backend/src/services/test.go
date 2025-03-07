package services

import (
	"bufio"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
	"mime/multipart"
	"os"
	"path/filepath"
	"src/dal"
	"src/model"
	"src/model/dto"
	"strings"
	"sync"
	"time"
)

// AddTestHandle            godoc
// @Summary      Add test
// @Description  Add test from json body
// @Tags         test
// @Produce      json
// @Param        test body dto.TestRequest true "Payload"
// @Success      200  {object} dto.IdResponse
// @Failure     400  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/test [post]
func AddTestHandle(ctx *gin.Context) {
	var request dto.TestRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	date := time.Now()
	id, _ := uuid.NewV4()
	Test := &model.Test{
		Id:         id,
		Name:       request.Name,
		CourseId:   request.CourseId,
		CreatedAt:  date,
		SchoolYear: request.SchoolYear,
	}
	err = dal.AddTestToDB(Test)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"id": id})
}

// GetTestsHandle            godoc
// @Summary      Get tests
// @Description  Get all tests
// @Tags         test
// @Produce      json
// @Success      200  {array}  dto.ListTest
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/test [get]
func GetTestsHandle(ctx *gin.Context) {
	tests, err := dal.GetTestsFromDB()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	//loop over tests and convert to listTest
	output := make([]dto.ListTest, len(tests))
	for i, test := range tests {
		output[i] = dto.ToListTest(test, dal.GetCountForTest(test.Id))
	}
	ctx.JSON(200, output)
}

// GetTestHandle            godoc
// @Summary      Get test
// @Description  Get test by id
// @Tags         test
// @Produce      json
// @Param        id  path  string  true  "Test ID"
// @Success      200  {object} dto.FullTest
// @Failure    404  {object} dto.ErrorResponse
// @Failure    500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/test/{id} [get]
func GetTestHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	test, err := dal.GetTestFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, dto.ToFullTest(*test))
}

// UpdateTestHandle            godoc
// @Summary      Update test
// @Description  Update test by id
// @Tags         test
// @Produce      json
// @Param        id  path  string  true  "Test ID"
// @Param        updatedTest body dto.EditTestRequest true "Payload"
// @Success      200  {object} dto.BaseResponse
// @Failure   404  {object} dto.ErrorResponse
// @Failure   500  {object} dto.ErrorResponse
// @Failure   400  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/test/{id} [put]
func UpdateTestHandle(ctx *gin.Context) {
	var request dto.EditTestRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, err := uuid.FromString(ctx.Param("id"))
	changedAt := time.Now()
	Test := &model.Test{
		Id:         id,
		Name:       request.Name,
		CourseId:   request.CourseId,
		ChangedAt:  &changedAt,
		SchoolYear: request.SchoolYear,
	}

	err = dal.UpdateTestInDB(Test)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"msg": "OK"})
}

// DeleteTestHandle            godoc
// @Summary      Delete test
// @Description  Delete test by id
// @Tags         test
// @Produce      json
// @Param        id  path  string  true  "Test ID"
// @Success      200  {object} dto.BaseResponse
// @Failure  404  {object} dto.ErrorResponse
// @Failure  500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/test/{id} [delete]
func DeleteTestHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	ap, err := GetAzureProviderInstance()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	err = ap.DeleteFiles(id.String())
	err = dal.DeleteTestFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"message": "OK"})
}

// ImportTestHandle            godoc
// @Summary      Import test
// @Description  Import test from zip file
// @Tags         test
// @Produce      json
// @Success      200  {object} dto.LogResponse
// @Failure     400  {object} dto.ErrorResponse
// @Failure     500  {object} dto.ErrorResponse
// @Param			file formData file true "file"
// @Param 	  testName query string true "Test name"
// @Param 	  schoolYear query string false "School year"
// @Param 	  courseId query string true "Course id"
// @Security     BearerAuth
// @Router       /api/v1/test/import [post]
func ImportTestHandle(ctx *gin.Context) {
	file, header, err := ctx.Request.FormFile("file")
	testName := ctx.Query("testName")
	schoolYear := ctx.Query("schoolYear")
	courseId, _ := uuid.FromString(ctx.Query("courseId"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
		}
	}(file)

	if header.Size > 10<<20 {
		ctx.JSON(400, gin.H{"error": "File size too big"})
		return
	}

	fileNameParts := strings.Split(header.Filename, ".")
	if fileNameParts[len(fileNameParts)-1] != "zip" {
		ctx.JSON(400, gin.H{"error": "File must be a zip archive"})
		return
	}
	testId, _ := uuid.NewV4()
	testModel := &model.Test{
		Id:         testId,
		Name:       testName,
		CourseId:   courseId,
		CreatedAt:  time.Now(),
		SchoolYear: schoolYear,
	}
	err = dal.AddTestToDB(testModel)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	archiveDest, err := unzipArchive(file, header)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	logs, err := processArchive(*archiveDest, testId)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	//delete temp folder
	err = os.RemoveAll(*archiveDest)
	response := dto.LogResponse{
		IdResponse: dto.IdResponse{Id: testId},
		Logs:       logs,
	}
	ctx.JSON(200, response)
}

func AddTestHandlers(router *gin.RouterGroup) {
	var subGroup = router.Group("/test", RequireAuth)
	subGroup.POST("", AddTestHandle)
	subGroup.GET("", GetTestsHandle)
	subGroup.GET(":id", GetTestHandle)
	subGroup.PUT(":id", UpdateTestHandle)
	subGroup.DELETE(":id", DeleteTestHandle)
	subGroup.POST("import", ImportTestHandle)
}

func processArchive(path string, testId uuid.UUID) ([]string, error) {
	ap, err := GetAzureProviderInstance()
	if err != nil {
		return nil, err
	}
	logs := make([]string, 0)
	var wg sync.WaitGroup
	sem := make(chan struct{}, 10)

	err = filepath.Walk(path, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			ext := strings.ToLower(filepath.Ext(info.Name()))
			if ext == ".txt" {
				// Increment the WaitGroup counter
				wg.Add(1)

				// Acquire a token
				sem <- struct{}{}

				// Launch a goroutine to process the question
				go func(path string) {
					// Decrement the WaitGroup counter when the goroutine completes
					defer wg.Done()

					// Release a token when the goroutine completes
					defer func() { <-sem }()

					log, err := processQuestion(path, testId, ap)
					if err != nil {
						fmt.Println("Error processing question:", err)
					}
					if log != "" {
						logs = append(logs, log)
					}
				}(path)
			}
		}
		return nil
	})
	wg.Wait()
	return logs, err
}

func processQuestion(path string, testId uuid.UUID, ap *AzureProvider) (string, error) {
	answers, questionConfig, body, err := readQuestionAttr(path)
	if err != nil {
		return err.Error(), err
	}
	if len(*questionConfig) != len(answers) {
		return "Number of answers does not correspond with question config for file " + path,
			errors.New("invalid question format")
	}
	var pictureName = ""
	if strings.HasPrefix(*body, "[img]") {
		bodyLen := len(*body)
		pictureName = (*body)[5 : bodyLen-6]
		*body = ""
	}
	subQuestion := dto.SubQuestion{
		Body:    *body,
		ImgFile: "",
	}
	questionModel := createNewQuestion(subQuestion, testId)
	err = dal.DB.Transaction(func(tx *gorm.DB) error {
		err = dal.AddQuestionToDB(&questionModel)
		if err != nil {
			return err
		}
		if pictureName != "" {
			err = handleQuestionImage(path, pictureName, ap, questionModel, testId)
			if err != nil {
				return err
			}
		}
		for index, answer := range answers {
			pictureName = ""
			if strings.HasPrefix(answer, "[img]") {
				end := strings.LastIndex(answer, "[/img]")
				pictureName = answer[5:end]
				answer = ""
			}
			answerModel := createNewAnswer(dto.SubAnswer{
				Body:    answer,
				Valid:   (*questionConfig)[index] == '1',
				ImgFile: "",
			}, questionModel.Id)
			err = dal.AddAnswerToDB(&answerModel)
			if err != nil {
				return err
			}
			if pictureName != "" {
				err = handleAnswerImage(path, pictureName, ap, answerModel, testId, questionModel.Id)
				if err != nil {
					return err
				}
			}
		}
		return nil
	})
	if err != nil {
		if strings.Contains(err.Error(), "open") {
			pathStart := strings.LastIndex(err.Error(), "open") + 5
			pathEnd := strings.LastIndex(err.Error(), ":")
			rawPath := err.Error()[pathStart:pathEnd]
			filename := filepath.Base(rawPath)
			return strings.Replace(err.Error(), rawPath, filename, 1), err
		}
		return err.Error(), err
	}
	return "", err
}

func handleQuestionImage(path string, pictureName string, ap *AzureProvider, questionModel model.Question, testId uuid.UUID) error {
	dir := filepath.Dir(path)
	picturePath := filepath.Join(dir, pictureName)
	file, err := os.Open(picturePath)
	if err != nil {
		return err
	}
	err = ap.UploadFileDirect(file, pictureName, testId, questionModel.Id, nil, dal.InsertImagePathToQuestionInDb)
	if err != nil {
		return err
	}
	return nil
}

func handleAnswerImage(path string, pictureName string, ap *AzureProvider, answerModel model.Answer, testId uuid.UUID, questionId uuid.UUID) error {
	dir := filepath.Dir(path)
	picturePath := filepath.Join(dir, pictureName)
	file, err := os.Open(picturePath)
	if err != nil {
		return err
	}
	err = ap.UploadFileDirect(file, pictureName, testId, questionId, &answerModel.Id, dal.InsertImagePathToAnswerInDb)
	if err != nil {
		return err
	}
	return nil
}

func readQuestionAttr(path string) ([]string, *string, *string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, nil, nil, err
	}
	scanner := bufio.NewScanner(file)

	questionConfig := ""
	body := ""
	answers := make([]string, 0)
	for scanner.Scan() {
		line := scanner.Text()
		if questionConfig == "" && !strings.HasPrefix(line, "X") {
			filename := filepath.Base(path)
			return nil, nil, nil, errors.New("invalid file format - missing config for question: " + filename)
		} else if questionConfig == "" {
			questionConfig = line[1:]
			continue
		}
		if body == "" {
			body = line
			continue
		}
		if line != "" {
			answerBody := strings.TrimSpace(line)
			answers = append(answers, answerBody)
		}
	}
	return answers, &questionConfig, &body, nil
}
