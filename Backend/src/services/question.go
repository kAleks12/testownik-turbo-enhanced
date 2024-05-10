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

// AddQuestionHandle            godoc
// @Summary      Add question
// @Description  Add question from json body
// @Tags         question
// @Produce      json
// @Param        question body dto.QuestionRequest true "Payload"
// @Success      200  {object} dto.IdResponse
// @Failure     400  {object} dto.ErrorResponse
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/question [post]
func AddQuestionHandle(ctx *gin.Context) {
	var request dto.QuestionRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, _ := uuid.NewV4()
	question := &model.Question{
		Id:      id,
		Body:    request.Body,
		ImgFile: request.ImgFile,
		TestId:  request.TestId,
	}
	err = dal.DB.Transaction(func(tx *gorm.DB) error {
		err = dal.AddQuestionToDB(question)
		if err != nil {
			return err
		}

		for _, answer := range request.Answers {
			dbAnswer := createNewAnswer(answer, question.Id)
			err = dal.AddAnswerToDB(&dbAnswer)
			if err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
	}
	ctx.JSON(200, gin.H{"id": id})
}

// GetQuestionsHandle            godoc
// @Summary      Get questions
// @Description  Get all questions
// @Tags         question
// @Produce      json
// @Success      200  {array}  dto.ListQuestion
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/question [get]
func GetQuestionsHandle(ctx *gin.Context) {
	questions, err := dal.GetQuestionsFromDB()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	//loop over tests and convert to listTest
	output := make([]dto.ListQuestion, len(questions))
	for i, question := range questions {
		output[i] = dto.ToListQuestion(question)
	}
	ctx.JSON(200, output)
}

// GetQuestionHandle            godoc
// @Summary      Get question
// @Description  Get question by id
// @Tags         question
// @Produce      json
// @Param        id path string true "Question ID"
// @Success      200  {object} dto.FullQuestion
// @Failure     404  {object} dto.ErrorResponse
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/question/{id} [get]
func GetQuestionHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	question, err := dal.GetQuestionFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, dto.ToFullQuestion(*question))
}

// UpdateQuestionHandle            godoc
// @Summary      Update question
// @Description  Update question by id
// @Tags         question
// @Produce      json
// @Param        id  path  string  true  "Question ID"
// @Param        updatedQuestion body dto.QuestionRequest true "Payload"
// @Success      200  {object} dto.IdResponse
// @Failure    404  {object} dto.ErrorResponse
// @Failure    500  {object} dto.ErrorResponse
// @Failure    400  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/question/{id} [put]
func UpdateQuestionHandle(ctx *gin.Context) {
	var request dto.EditQuestionRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, err := uuid.FromString(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	existingQuestion, err := dal.GetQuestionFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	}
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	existingQuestion.Body = request.Body
	existingQuestion.ImgFile = request.ImgFile
	newAnswers, existingAnswers := prepareAnswers(request, existingQuestion)
	err = handleAnswers(existingQuestion, existingAnswers, newAnswers)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	}
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"id": id})
}

// DeleteQuestionHandle            godoc
// @Summary      Delete question
// @Description  Delete question by id
// @Tags         question
// @Produce      json
// @Param        id  path  string  true  "Question ID"
// @Success      200  {object} dto.BaseResponse
// @Failure  404  {object} dto.ErrorResponse
// @Failure  500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/question/{id} [delete]
func DeleteQuestionHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	ap, err := GetAzureProviderInstance()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	prefix, err := buildQuestionImagePrefix(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err = ap.DeleteFiles(*prefix)

	err = dal.DeleteQuestionFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "OK"})

}

// AddImageHandle            godoc
// @Summary      Add image to question
// @Description  Add image to question by id
// @Tags         image
// @Produce      json
// @Param        id  path  string  true  "Question ID"
// @Param			file formData file true "file"
// @Success      200  {object} dto.BaseResponse
// @Failure  404  {object} dto.ErrorResponse
// @Failure  500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/question/{id}/image [post]
func AddImageHandle(ctx *gin.Context) {
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
	testId, err := getQuestionPrefixData(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err = azureProvider.UploadFile(ctx, *testId, id, nil, dal.InsertImagePathToQuestionInDb)
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

// DeleteImageHandle            godoc
// @Summary      Delete image from question
// @Description  Delete image from question by id
// @Tags         image
// @Produce      json
// @Param        id  path  string  true  "Question ID"
// @Success      200  {object} dto.BaseResponse
// @Failure  404  {object} dto.ErrorResponse
// @Failure  500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/question/{id}/image [delete]
func DeleteImageHandle(ctx *gin.Context) {
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

	prefix, err := buildQuestionImagePrefix(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = azureProvider.DeleteFilesCallback(*prefix, id, dal.ClearImagePathFromQuestionInDb)
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

func AddQuestionHandlers(router *gin.RouterGroup) {
	var subGroup = router.Group("/question", RequireAuth)
	subGroup.POST("", AddQuestionHandle)
	subGroup.GET("", GetQuestionsHandle)
	subGroup.GET(":id", GetQuestionHandle)
	subGroup.PUT(":id", UpdateQuestionHandle)
	subGroup.POST(":id/image", AddImageHandle)
	subGroup.DELETE(":id", DeleteQuestionHandle)
	subGroup.DELETE(":id/image", DeleteImageHandle)
}

func prepareAnswers(request dto.EditQuestionRequest, existingQuestion *model.Question) ([]model.Answer, []model.Answer) {
	//Build new answers and existing answers lists
	var newAnswers []model.Answer
	var existingAnswers []model.Answer
	for _, answer := range request.Answers {
		if answer.Id == nil {
			newAnswers = append(newAnswers, createNewAnswer(answer.SubAnswer, existingQuestion.Id))
		} else {
			existingAnswers = append(existingAnswers, model.Answer{
				Id:         *answer.Id,
				Body:       answer.Body,
				Valid:      answer.Valid,
				QuestionId: existingQuestion.Id,
			})
		}
	}
	return newAnswers, existingAnswers
}

func handleAnswers(existingQuestion *model.Question, existingAnswers []model.Answer, newAnswers []model.Answer) error {
	return dal.DB.Transaction(func(tx *gorm.DB) error {
		// Update question info
		err := dal.UpdateQuestionInDB(existingQuestion)
		if err != nil {
			return err
		}

		// Delete answers that are not in the request
		for _, answer := range existingQuestion.Answers {
			if !containsAnswer(existingAnswers, answer) {
				err := dal.DeleteAnswerFromDB(answer.Id)
				if err != nil {
					return err
				}
			}
		}
		// Update existing answers
		for _, answer := range existingAnswers {
			err := dal.UpdateAnswerInDB(&answer)
			if err != nil {
				return err
			}
		}
		// Add new answers
		for _, answer := range newAnswers {
			err := dal.AddAnswerToDB(&answer)
			if err != nil {
				return err
			}
		}
		return nil
	})
}

func buildQuestionImagePrefix(id uuid.UUID) (*string, error) {
	question, err := dal.GetQuestionFromDB(id)
	if err != nil {
		return nil, err
	}
	prefix := question.TestId.String() + "_" + question.Id.String()
	return &prefix, nil
}

func getQuestionPrefixData(id uuid.UUID) (*uuid.UUID, error) {
	question, err := dal.GetQuestionFromDB(id)
	if err != nil {
		return nil, err
	}
	testId := question.TestId
	return &testId, nil
}
