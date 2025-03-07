package dal

import (
	"crypto/sha512"
	"encoding/hex"
	"src/model"
)

func AddUserToDB(user *model.User) error {
	hasher := sha512.New()
	hasher.Write([]byte(user.Password))
	hashedPassword := hex.EncodeToString(hasher.Sum(nil))
	user.Password = hashedPassword

	result := DB.Create(user)
	return result.Error
}

func GetUserFromDB(username string) (*model.User, error) {
	var user model.User
	result := DB.Where("username = ?", username).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}

func UserExists(username string) bool {
	var user model.User
	result := DB.Where("username = ?", username).First(&user)
	return result.Error == nil
}
