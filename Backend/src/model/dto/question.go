package dto

import (
	"github.com/gofrs/uuid"
	"src/model"
)

type ListQuestion struct {
	Id      uuid.UUID `json:"id"`
	Body    string    `json:"body"`
	ImgFile string    `json:"imgFile"`
	TestId  uuid.UUID `json:"testId"`
}

func ToListQuestion(question model.Question) ListQuestion {
	return ListQuestion{
		Id:      question.Id,
		Body:    question.Body,
		ImgFile: question.ImgFile,
		TestId:  question.TestId,
	}
}

type FullQuestion struct {
	Id      uuid.UUID      `json:"id"`
	Body    string         `json:"body"`
	ImgFile string         `json:"imgFile"`
	TestId  uuid.UUID      `json:"testId"`
	Answers []model.Answer `json:"answers"`
}

func ToFullQuestion(question model.Question) FullQuestion {
	return FullQuestion{
		Id:      question.Id,
		Body:    question.Body,
		ImgFile: question.ImgFile,
		TestId:  question.TestId,
		Answers: question.Answers,
	}
}
