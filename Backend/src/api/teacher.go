package api

import (
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"src/db"
)

type AddTeacherRequest struct {
	Name       string `json:"name"`
	SecondName string `json:"second_name"`
	Surname    string `json:"surname"`
}

func AddTeacherHandle(ctx *gin.Context) {
	var request AddTeacherRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	id, _ := uuid.NewV4()
	teacher := &db.Teacher{
		Id:         id,
		Name:       request.Name,
		SecondName: request.SecondName,
		Surname:    request.Surname,
	}

	err = db.AddTeacherToDB(teacher)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "OK"})
}

func GetTeachersHandle(ctx *gin.Context) {
	teachers, err := db.GetTeachersFromDB()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, teachers)
}
