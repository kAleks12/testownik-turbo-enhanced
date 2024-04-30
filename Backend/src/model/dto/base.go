package dto

import "github.com/gofrs/uuid"

type BaseResponse struct {
	Message string
}

type IdResponse struct {
	Id uuid.UUID
}

type ErrorResponse struct {
	Error string
}
