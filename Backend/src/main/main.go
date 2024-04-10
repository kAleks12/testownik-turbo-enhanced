package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"src/api"
)

func main() {
	router := gin.Default()
	router.POST("/teacher", api.AddTeacherHandle)
	router.GET("/teacher", api.GetTeachersHandle)
	err := router.Run("localhost:9090")
	if err != nil {
		fmt.Println("Gin error occured: ", err)
	}
}
