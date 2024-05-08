package services

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
	"time"
)

func RequireAuth(c *gin.Context) {
	// Get the cookie off the request
	tokenString := c.GetHeader("Authorization")

	if tokenString == "" {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
	if len(tokenString) < 7 || tokenString[:7] != "Bearer " {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
	tokenString = tokenString[7:]
	// Decode/validate it
	var secret = os.Getenv("TOKEN_SECRET")
	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check the expiry date
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		// Find the user with token Subject
		sub, exists := claims["usos_id"]
		if !exists {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		// Attach the request
		c.Set("user", sub)
		c.Set("token", "Bearer "+tokenString)
		c.Next()
	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}
