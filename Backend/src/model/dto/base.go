package dto

import "github.com/gofrs/uuid"

type BaseResponse struct {
	Message string
}

type IdResponse struct {
	Id uuid.UUID `json:"id"`
}

type LogResponse struct {
	IdResponse
	Logs []string `json:"logs"`
}

type ErrorResponse struct {
	Error string
}

type UrlResponse struct {
	Url string `json:"url"`
}
