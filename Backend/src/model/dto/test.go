package dto

import (
	"github.com/gofrs/uuid"
	"src/model"
	"time"
)

type ListTest struct {
	Id           uuid.UUID    `json:"id"`
	Name         string       `json:"name"`
	CreatedAt    time.Time    `json:"createdAt"`
	ChangedAt    *time.Time   `json:"changedAt"`
	Course       model.Course `json:"course"`
	SchoolYear   string       `json:"schoolYear"`
	QuestionSize int64        `json:"questionSize"`
}

func ToListTest(test model.Test, questionSize int64) ListTest {
	return ListTest{
		Id:           test.Id,
		Name:         test.Name,
		CreatedAt:    test.CreatedAt,
		ChangedAt:    test.ChangedAt,
		Course:       test.Course,
		SchoolYear:   test.SchoolYear,
		QuestionSize: questionSize,
	}
}

type FullTest struct {
	Id         uuid.UUID        `json:"id"`
	Name       string           `json:"name"`
	Questions  []model.Question `json:"questions"`
	Course     model.Course     `json:"course"`
	SchoolYear string           `json:"schoolYear"`
}

func ToFullTest(test model.Test) FullTest {
	return FullTest{
		Id:         test.Id,
		Name:       test.Name,
		Questions:  test.Questions,
		Course:     test.Course,
		SchoolYear: test.SchoolYear,
	}
}
