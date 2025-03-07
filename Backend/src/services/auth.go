package services

import (
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"os"
	"regexp"
	"src/dal"
	"src/model"
	"src/model/dto"
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

// AddUserHandle            godoc
// @Summary      Add user
// @Description  Add user from json body
// @Tags         user
// @Produce      json
// @Success      200  {object} dto.TokenResponse
// @Failure     400  {object} dto.ErrorResponse
// @Failure     500  {object} dto.ErrorResponse
// @Param        user body dto.NewUserRequest true "User data"
// @Router       /api/v1/user/register [post]
func AddUserHandle(ctx *gin.Context) {
	var request dto.NewUserRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if !isValidPassword(request.Password) {
		ctx.JSON(400, gin.H{"error": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"})
		return
	}
	if dal.UserExists(request.Nickname) {
		ctx.JSON(400, gin.H{"error": "User with this username already exists"})
		return
	}

	id, _ := uuid.NewV4()

	user := &model.User{
		Id:        id,
		Username:  request.Nickname,
		FirstName: request.FirstName,
		LastName:  request.LastName,
		Password:  request.Password,
	}

	err = dal.AddUserToDB(user)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	tokenString := createToken(request.Nickname, err)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dto.ToTokenResponse(tokenString, user))
}

// LoginUserHandle            godoc
// @Summary      Login
// @Description  Login user from json body
// @Tags         user
// @Produce      json
// @Success      200  {object} dto.TokenResponse
// @Failure     400  {object} dto.ErrorResponse
// @Failure     500  {object} dto.ErrorResponse
// @Param        user body dto.LoginRequest true "User data"
// @Router       /api/v1/user/login [post]
func LoginUserHandle(ctx *gin.Context) {
	var request dto.LoginRequest
	err := ctx.BindJSON(&request)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user, err := dal.GetUserFromDB(request.Nickname)
	if err != nil {
		ctx.JSON(404, gin.H{"error": err.Error()})
		return
	}

	if !checkUserPassword(user, request.Password) {
		ctx.JSON(401, gin.H{"error": "Invalid username or password"})
		return
	}

	tokenString := createToken(request.Nickname, err)

	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dto.ToTokenResponse(tokenString, user))
}

func createToken(nickname string, err error) string {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["usos_id"] = nickname
	claims["exp"] = time.Now().Add(time.Hour * 2).Unix()
	secret := os.Getenv("TOKEN_SECRET")
	tokenString, err := token.SignedString([]byte(secret))
	return tokenString
}

func AddUserHandlers(router *gin.RouterGroup) {
	var subGroup = router.Group("/user")
	subGroup.POST("/register", AddUserHandle)
	subGroup.POST("/login", LoginUserHandle)
}

func checkUserPassword(user *model.User, password string) bool {
	hasher := sha512.New()
	hasher.Write([]byte(password))
	hashedPassword := hex.EncodeToString(hasher.Sum(nil))

	return user.Password == hashedPassword
}

func isValidPassword(password string) bool {
	if len(password) < 8 {
		return false
	}
	lowercase := regexp.MustCompile(`[a-z]`)
	uppercase := regexp.MustCompile(`[A-Z]`)
	digit := regexp.MustCompile(`\d`)
	special := regexp.MustCompile(`[@$!%*?&]`)

	return lowercase.MatchString(password) &&
		uppercase.MatchString(password) &&
		digit.MatchString(password) &&
		special.MatchString(password)
}
