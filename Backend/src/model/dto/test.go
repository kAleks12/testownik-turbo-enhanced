package dto

import (
	"github.com/gofrs/uuid"
	"src/model"
	"time"
)

type ListTest struct {
	Id         uuid.UUID    `json:"id"`
	Name       string       `json:"name"`
	CreatedBy  string       `json:"createdBy"`
	CourseId   string       `json:"courseId"`
	CreatedAt  time.Time    `json:"createdAt"`
	ChangedBy  *string      `json:"changedBy"`
	ChangedAt  *time.Time   `json:"changedAt"`
	Course     model.Course `json:"course"`
	SchoolYear string       `json:"schoolYear"`
}

func ToListTest(test model.Test) ListTest {
	return ListTest{
		Id:         test.Id,
		Name:       test.Name,
		CreatedBy:  test.CreatedBy,
		CreatedAt:  test.CreatedAt,
		ChangedBy:  test.ChangedBy,
		ChangedAt:  test.ChangedAt,
		Course:     test.Course,
		SchoolYear: test.SchoolYear,
	}
}

type FullTest struct {
	Id        uuid.UUID        `json:"id"`
	Name      string           `json:"name"`
	Questions []model.Question `json:"questions"`
	Course    model.Course     `json:"course"`
}

func ToFullTest(test model.Test) FullTest {
	return FullTest{
		Id:        test.Id,
		Name:      test.Name,
		Questions: test.Questions,
		Course:    test.Course,
	}
}
