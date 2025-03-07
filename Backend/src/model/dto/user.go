package dto

import "src/model"

type TokenResponse struct {
	Token     string `json:"token"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func ToTokenResponse(token string, user *model.User) TokenResponse {
	return TokenResponse{
		Token:     token,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
}
