package db

import (
	"github.com/gofrs/uuid"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Testownik struct {
	Id        uuid.UUID             `json:"id"`
	Name      string                `json:"name"`
	CreatedBy string                `json:"created_by"`
	ChangedBy string                `json:"changed_by"`
	CreatedAt timestamppb.Timestamp `json:"created_at"`
	CourseId  uuid.UUID             `json:"course_id"`
}

type Course struct {
	Id         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	Teacher    uuid.UUID `json:"teacher"`
	SchoolYear int       `json:"school_year"`
}

type Teacher struct {
	Id         uuid.UUID `json:"id"`
	Name       string    `json:"name"`
	SecondName string    `json:"second_name"`
	Surname    string    `json:"surname"`
}

type Question struct {
	Id          uuid.UUID `json:"id"`
	Body        string    `json:"body"`
	ImgFile     string    `json:"img_file"`
	TestownikId uuid.UUID `json:"testownik_id"`
}

type Answer struct {
	Id         uuid.UUID `json:"id"`
	QuestionId uuid.UUID `json:"question_id"`
	Body       string    `json:"body"`
	Valid      bool      `json:"valid"`
}

func AddTeacherToDB(teacher *Teacher) error {
	dbC := DB
	result := dbC.Create(teacher)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func GetTeachersFromDB() ([]Teacher, error) {
	dbC := DB
	var teachers []Teacher
	result := dbC.Find(&teachers)
	if result.Error != nil {
		return nil, result.Error
	}
	return teachers, nil
}
