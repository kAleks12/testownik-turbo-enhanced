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

// AddCourse            godoc
// @Summary      Add course
// @Description  Add course from json body
// @Tags         course
// @Produce      json
// @Param        course body dto.CourseRequest true "Payload"
// @Success      200  {object} dto.IdResponse
// @Failure     400  {object} dto.ErrorResponse
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/course [post]
func AddCourseHandle(ctx *gin.Context) {
	var request dto.CourseRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, _ := uuid.NewV4()
	course := &model.Course{
		Id:         id,
		Name:       request.Name,
		TeacherId:  request.TeacherId,
		UsosId:     request.UsosId,
		CourseType: request.CourseType,
	}

	err = dal.AddCourseToDB(course)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"id": id})
}

// GetCourses            godoc
// @Summary      Get courses
// @Description  Get all courses
// @Tags         course
// @Produce      json
// @Success      200  {array}  dto.FullCourse
// @Failure     500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/course [get]
func GetCoursesHandle(ctx *gin.Context) {
	courses, err := dal.GetCoursesFromDB()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	activeCourses, _ := GetActiveUserCourses(ctx)
	output := make([]dto.FullCourse, 0, len(courses))
	for _, course := range courses {
		_, active := activeCourses[course.Id]
		output = append(output, dto.ToFullCourse(course, active))
	}
	ctx.JSON(200, output)
}

// GetCourse            godoc
// @Summary      Get course
// @Description  Get course by id
// @Tags         course
// @Produce      json
// @Param        id path string true "Course ID"
// @Success      200  {object} dto.FullCourse
// @Failure    404  {object} dto.ErrorResponse
// @Failure    500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/course/{id} [get]
func GetCourseHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	course, err := dal.GetCourseFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	activeCourses, _ := GetActiveUserCourses(ctx)
	_, active := activeCourses[course.Id]
	ctx.JSON(200, dto.ToFullCourse(*course, active))
}

// UpdateCourse            godoc
// @Summary      Update course
// @Description  Update course by id
// @Tags         course
// @Produce      json
// @Param        id  path  string  true  "Course ID"
// @Param        updatedCourse body dto.CourseRequest true "Payload"
// @Success      200  {object} dto.BaseResponse
// @Failure    404  {object} dto.ErrorResponse
// @Failure    500  {object} dto.ErrorResponse
// @Failure    400  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/course/{id} [put]
func UpdateCourseHandle(ctx *gin.Context) {
	var request dto.CourseRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, err := uuid.FromString(ctx.Param("id"))
	Course := &model.Course{
		Id:         id,
		Name:       request.Name,
		TeacherId:  request.TeacherId,
		UsosId:     request.UsosId,
		CourseType: request.CourseType,
	}

	err = dal.UpdateCourseInDB(Course)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "OK"})
}

// DeleteCourse            godoc
// @Summary      Delete course
// @Description  Delete course by id
// @Tags         course
// @Produce      json
// @Param        id  path  string  true  "Course ID"
// @Success      200  {object} dto.BaseResponse
// @Failure   404  {object} dto.ErrorResponse
// @Failure   500  {object} dto.ErrorResponse
// @Security     BearerAuth
// @Router       /api/v1/course/{id} [delete]
func DeleteCourseHandle(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	err = dal.DeleteCourseFromDB(id)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		ctx.JSON(404, gin.H{"Record not found with id": id})
		return
	} else if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "OK"})

}

func AddCourseHandlers(router *gin.RouterGroup) {
	var subGroup = router.Group("/course", RequireAuth)
	subGroup.POST("", AddCourseHandle)
	subGroup.GET("", GetCoursesHandle)
	subGroup.GET(":id", GetCourseHandle)
	subGroup.PUT(":id", UpdateCourseHandle)
	subGroup.DELETE(":id", DeleteCourseHandle)
}
