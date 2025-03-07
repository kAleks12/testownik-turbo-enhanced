package dto

import (
	"github.com/gofrs/uuid"
	"src/model"
)

type FullCourse struct {
	Id         uuid.UUID     `json:"id"`
	Name       string        `json:"name"`
	Teacher    model.Teacher `json:"teacher"`
	UsosId     string        `json:"usosId"`
	CourseType string        `json:"courseType"`
}

func ToFullCourse(course model.Course) FullCourse {
	return FullCourse{
		Id:         course.Id,
		Name:       course.Name,
		Teacher:    *course.Teacher,
		UsosId:     course.UsosId,
		CourseType: course.CourseType,
	}
}
