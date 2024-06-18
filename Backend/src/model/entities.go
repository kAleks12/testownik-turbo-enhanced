package model

import (
	"github.com/gofrs/uuid"
	"time"
)

type Answer struct {
	Id         uuid.UUID `json:"id"`
	QuestionId uuid.UUID `json:"questionId"`
	Body       string    `json:"body"`
	ImgFile    string    `json:"imgFile"`
	Valid      bool      `json:"valid"`
}

type Teacher struct {
	Id         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	SecondName string    `json:"secondName"`
	Surname    string    `json:"surname"`
}

type Course struct {
	Id         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	UsosId     string    `json:"usosId"`
	CourseType string    `json:"courseType"`
	TeacherId  uuid.UUID `json:"teacherId"`
	Teacher    *Teacher  `json:"teacher"  gorm:"foreignKey:TeacherId"`
}

type Question struct {
	Id      uuid.UUID `json:"id"`
	Body    string    `json:"body"`
	ImgFile string    `json:"imgFile"`
	Answers []Answer  `json:"answers"`
	TestId  uuid.UUID `json:"testId"`
}

type Test struct {
	Id         uuid.UUID  `json:"id"`
	Name       string     `json:"name"`
	CreatedAt  time.Time  `json:"createdAt"`
	Course     Course     `json:"course" gorm:"foreignKey:CourseId"`
	CourseId   uuid.UUID  `json:"courseId"`
	ChangedAt  *time.Time `json:"changedAt"`
	Questions  []Question `json:"questions"`
	SchoolYear string     `json:"schoolYear"`
}
