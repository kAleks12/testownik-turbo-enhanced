package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"os"
	_ "src/main/docs"
	"src/services"
)

// @title           Swagger ZIWG_testo API
// @version         1.0
// @description     REST API for ZIWG_testo project
// @securitydefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	router := gin.Default()
	var defaultGroup = router.Group("api/v1")
	services.AddTeacherHandlers(defaultGroup)
	services.AddCourseHandlers(defaultGroup)
	services.AddQuestionHandlers(defaultGroup)
	services.AddAnswerHandlers(defaultGroup)
	services.AddTestHandlers(defaultGroup)
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	err := router.Run(os.Getenv("ADDRESS"))
	if err != nil {
		fmt.Println("Gin error occurred: ", err)
	}
}
