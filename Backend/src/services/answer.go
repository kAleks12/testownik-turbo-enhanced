package services

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
	"net/http"
	"src/dal"
	"src/model"
	"src/model/dto"
)

// AddAnswerHandle            godoc
// @Summary      Add answer
// @Description  Add answer from json body
// @Tags         answer
// @Produce      json
// @Param        answer body dto.AnswerRequest true "Payload"
// @Success      200  {object} dto.IdResponse
// @Failure     400  {object} dto.ErrorResponse
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/answer [post]
func AddAnswerHandle(ctx *gin.Context) {
	var request dto.AnswerRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, _ := uuid.NewV4()
	answer := &model.Answer{
		Id:         id,
		Body:       request.Body,
		QuestionId: request.QuestionId,
		Valid:      request.Valid,
		ImgFile:    request.ImgFile,
	}
	err = dal.AddAnswerToDB(answer)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"id": id})
}

// GetAnswersHandle            godoc
// @Summary      Get answers
// @Description  Get all answers
// @Tags         answer
// @Produce      json
// @Success      200  {array}  model.Answer
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/answer [get]
func GetAnswersHandle(ctx *gin.Context) {
	answers, err := dal.GetAnswersFromDB()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, answers)
}

// GetAnswerHandle            godoc
// @Summary      Get answer
// @Description  Get answer by id
// @Tags         answer
// @Produce      json
// @Param        id path string true "Answer ID"
// @Success      200  {object} model.Answer
// @Failure    404  {object} dto.ErrorResponse
// @Failure    500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/answer/{id} [get]
func GetAnswerHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	answer, err := dal.GetAnswerFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, answer)
}

// UpdateAnswerHandle            godoc
// @Summary      Update answer
// @Description  Update answer by id
// @Tags         answer
// @Produce      json
// @Param        id  path  string  true  "Answer ID"
// @Param        updatedAnswer body dto.AnswerRequest true "Payload"
// @Success      200  {object} dto.BaseResponse
// @Failure    404  {object} dto.ErrorResponse
// @Failure    500  {object} dto.ErrorResponse
// @Failure    400  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/answer/{id} [put]
func UpdateAnswerHandle(ctx *gin.Context) {
	var request dto.AnswerRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, err := uuid.FromString(ctx.Param("id"))
	answer := &model.Answer{
		Id:         id,
		Body:       request.Body,
		Valid:      request.Valid,
		QuestionId: request.QuestionId,
		ImgFile:    request.ImgFile,
	}
	err = dal.UpdateAnswerInDB(answer)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "OK"})
}

// DeleteAnswerHandle            godoc
// @Summary      Delete answer
// @Description  Delete answer by id
// @Tags         answer
// @Produce      json
// @Param        id  path  string  true  "Answer ID"
// @Success      200  {object} dto.BaseResponse
// @Failure   404  {object} dto.ErrorResponse
// @Failure   500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/answer/{id} [delete]
func DeleteAnswerHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	err = dal.DeleteAnswerFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "OK"})

}

// AddAnswerImageHandle            godoc
// @Summary      Add image to answer
// @Description  Add image to answer by id
// @Tags         image
// @Produce      json
// @Param        id  path  string  true  "Answer ID"
// @Param			file formData file true "file"
// @Success      200  {object} dto.BaseResponse
// @Failure  404  {object} dto.ErrorResponse
// @Failure  500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/answer/{id}/image [post]
func AddAnswerImageHandle(ctx *gin.Context) {
	azureProvider, err := GetAzureProviderInstance()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, err := uuid.FromString(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	testId, questionId, err := getAnswerPrefixData(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err = azureProvider.UploadFile(ctx, *testId, *questionId, &id, dal.InsertImagePathToAnswerInDb)
	if err != nil {
		var ginErr *gin.Error
		if errors.As(err, &ginErr) {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK"})
}

// DeleteAnswerImageHandle            godoc
// @Summary      Delete image from answer
// @Description  Delete image from answer by id
// @Tags         image
// @Produce      json
// @Param        id  path  string  true  "Question ID"
// @Success      200  {object} dto.BaseResponse
// @Failure  404  {object} dto.ErrorResponse
// @Failure  500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/answer/{id}/image [delete]
func DeleteAnswerImageHandle(ctx *gin.Context) {
	azureProvider, err := GetAzureProviderInstance()
	if err != nil {
		fmt.Printf("Failed to create AzureProvider: %v\n", err)
		return
	}

	id, err := uuid.FromString(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	prefix, err := buildAnswerImagePrefix(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err = azureProvider.DeleteFilesCallback(*prefix, id, dal.ClearImagePathFromAnswerInDb)
	if err != nil {
		var ginErr *gin.Error
		if errors.As(err, &ginErr) {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "OK"})
}

func AddAnswerHandlers(router *gin.RouterGroup) {
	var subGroup = router.Group("/answer", RequireAuth)
	subGroup.POST("", AddAnswerHandle)
	subGroup.GET("", GetAnswersHandle)
	subGroup.GET(":id", GetAnswerHandle)
	subGroup.PUT(":id", UpdateAnswerHandle)
	subGroup.DELETE(":id", DeleteAnswerHandle)
	subGroup.POST(":id/image", AddAnswerImageHandle)
	subGroup.DELETE(":id/image", DeleteAnswerImageHandle)
}

func buildAnswerImagePrefix(id uuid.UUID) (*string, error) {
	answer, err := dal.GetAnswerFromDB(id)
	if err != nil {
		return nil, err
	}
	question, err := dal.GetQuestionFromDB(answer.QuestionId)
	if err != nil {
		return nil, err
	}
	prefix := question.TestId.String() + "_" + question.Id.String() + "_" + answer.Id.String()
	return &prefix, nil
}

func getAnswerPrefixData(id uuid.UUID) (*uuid.UUID, *uuid.UUID, error) {
	answer, err := dal.GetAnswerFromDB(id)
	if err != nil {
		return nil, nil, err
	}
	question, err := dal.GetQuestionFromDB(answer.QuestionId)
	if err != nil {
		return nil, nil, err
	}
	questionId := question.Id
	testId := question.TestId
	return &testId, &questionId, nil
}
