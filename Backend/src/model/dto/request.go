package dto

import "github.com/gofrs/uuid"

// Teacher models
type TeacherRequest struct {
	Name       string `json:"name"`
	SecondName string `json:"secondName"`
	Surname    string `json:"surname"`
}

// Course models
type CourseRequest struct {
	Name       string    `json:"name"`
	TeacherId  uuid.UUID `json:"teacherId"`
	UsosId     string    `json:"usosId"`
	CourseType string    `json:"courseType"`
}

// Test models
type TestRequest struct {
	Name       string        `json:"name"`
	CourseId   uuid.UUID     `json:"courseId"`
	SchoolYear string        `json:"schoolYear"`
	Questions  []SubQuestion `json:"questions"`
}

type EditTestRequest struct {
	Name       string    `json:"name"`
	CourseId   uuid.UUID `json:"courseId"`
	SchoolYear string    `json:"schoolYear"`
}

// Question models
type QuestionRequest struct {
	Body    string      `json:"body"`
	ImgFile string      `json:"imgFile"`
	TestId  uuid.UUID   `json:"testId"`
	Answers []SubAnswer `json:"answers"`
}

type EditQuestionRequest struct {
	Body    string          `json:"body"`
	ImgFile string          `json:"imgFile"`
	Answers []EditSubAnswer `json:"answers"`
}

type SubQuestion struct {
	Body    string      `json:"body"`
	ImgFile string      `json:"imgFile"`
	Answers []SubAnswer `json:"answers"`
}

// Answer models
type AnswerRequest struct {
	QuestionId uuid.UUID `json:"questionId"`
	Body       string    `json:"body"`
	Valid      bool      `json:"valid"`
}

type SubAnswer struct {
	Body  string `json:"body"`
	Valid bool   `json:"valid"`
}

type EditSubAnswer struct {
	SubAnswer
	Id *uuid.UUID `json:"id"`
}
