package services

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
	"src/dal"
	"src/model"
	"src/model/dto"
)

// AddTeacherHandle            godoc
// @Summary      Add teacher
// @Description  Add teacher from json body
// @Tags         teacher
// @Produce      json
// @Param	teacher	body dto.TeacherRequest	true "Payload"
// @Success      200  {object} dto.IdResponse
// @Failure     400  {object} dto.ErrorResponse
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/teacher [post]
func AddTeacherHandle(ctx *gin.Context) {
	var request dto.TeacherRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, _ := uuid.NewV4()
	teacher := &model.Teacher{
		Id:         id,
		Name:       request.Name,
		SecondName: request.SecondName,
		Surname:    request.Surname,
	}

	err = dal.AddTeacherToDB(teacher)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"id": id})
}

// GetTeachersHandle            godoc
// @Summary      Get teachers
// @Description  Get all teachers
// @Tags         teacher
// @Produce      json
// @Success      200  {array}  model.Teacher
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/teacher [get]
func GetTeachersHandle(ctx *gin.Context) {
	teachers, err := dal.GetTeachersFromDB()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, teachers)
}

// GetTeacherHandle            godoc
// @Summary      Get teacher
// @Description  Get teacher by id
// @Tags         teacher
// @Produce      json
// @Param        id  path  string  true  "Teacher ID"
// @Success      200  {object}  model.Teacher
// @Failure     404  {object} dto.ErrorResponse
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/teacher/{id} [get]
func GetTeacherHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	teacher, err := dal.GetTeacherFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, teacher)
}

// UpdateTeacherHandle  godoc
// @Summary  Update teacher
// @Description  Update teacher by id
// @Tags   teacher
// @Produce      json
// @Param        id  path  string  true  "Teacher ID"
//
//	@Param	updatedTeacher	body dto.TeacherRequest	true "Payload"
//
// @Success      200  {object} dto.BaseResponse
// @Failure    404  {object} dto.ErrorResponse
// @Failure    500  {object} dto.ErrorResponse
// @Failure    400  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/teacher/{id} [put]
func UpdateTeacherHandle(ctx *gin.Context) {
	var request dto.TeacherRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, err := uuid.FromString(ctx.Param("id"))
	teacher := &model.Teacher{
		Id:         id,
		Name:       request.Name,
		SecondName: request.SecondName,
		Surname:    request.Surname,
	}

	err = dal.UpdateTeacherInDB(teacher)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "OK"})
}

// DeleteTeacherHandle            godoc
// @Summary      Delete teacher
// @Description  Delete teacher by id
// @Tags         teacher
// @Produce      json
// @Param        id  path  string  true  "Teacher ID"
// @Success      200  {object} dto.BaseResponse
// @Failure  404  {object} dto.ErrorResponse
// @Failure  500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/teacher/{id} [delete]
func DeleteTeacherHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	err = dal.DeleteTeacherFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "OK"})

}

func AddTeacherHandlers(router *gin.RouterGroup) {
	var subGroup = router.Group("/teacher", RequireAuth)
	subGroup.POST("", AddTeacherHandle)
	subGroup.GET("", GetTeachersHandle)
	subGroup.GET(":id", GetTeacherHandle)
	subGroup.PUT(":id", UpdateTeacherHandle)
	subGroup.DELETE(":id", DeleteTeacherHandle)
}
