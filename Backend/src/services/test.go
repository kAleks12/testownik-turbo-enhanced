package services

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
	"src/dal"
	"src/model"
	"src/model/dto"
	"time"
)

// AddTest            godoc
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
	userId, _ := ctx.Get("user")
	createdBy := userId.(string)
	date := time.Now()
	id, _ := uuid.NewV4()
	Test := &model.Test{
		Id:        id,
		Name:      request.Name,
		CreatedBy: createdBy,
		CourseId:  request.CourseId,
		CreatedAt: date,
		ChangedBy: nil,
	}
	err = dal.DB.Transaction(func(tx *gorm.DB) error {
		err = dal.AddTestToDB(Test)
		if err != nil {
			return err
		}
		for _, question := range request.Questions {
			newQuestion := createNewQuestion(question, id)
			err = dal.AddQuestionToDB(&newQuestion)
			if err != nil {
				return err
			}
			for _, answer := range question.Answers {
				newAnswer := createNewAnswer(answer, newQuestion.Id)
				err = dal.AddAnswerToDB(&newAnswer)
				if err != nil {
					return err
				}
			}
		}
		return nil
	})
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"id": id})
}

// GetTests            godoc
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
		output[i] = dto.ToListTest(test)
	}
	ctx.JSON(200, output)
}

// GetTest            godoc
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

// UpdateTest            godoc
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
	userId, _ := ctx.Get("user")
	changedBy := userId.(string)
	changedAt := time.Now()
	Test := &model.Test{
		Id:        id,
		Name:      request.Name,
		ChangedBy: &changedBy,
		CourseId:  request.CourseId,
		ChangedAt: &changedAt,
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

// DeleteTest            godoc
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

func AddTestHandlers(router *gin.RouterGroup) {
	var subGroup = router.Group("/test", RequireAuth)
	subGroup.POST("", AddTestHandle)
	subGroup.GET("", GetTestsHandle)
	subGroup.GET(":id", GetTestHandle)
	subGroup.PUT(":id", UpdateTestHandle)
	subGroup.DELETE(":id", DeleteTestHandle)
}
