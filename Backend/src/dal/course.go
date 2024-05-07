package dal

import (
	"github.com/gofrs/uuid"
	"src/model"
)

func AddCourseToDB(course *model.Course) error {
	result := DB.Create(course)
	return result.Error
}

func GetCoursesFromDB() ([]model.Course, error) {
	var courses []model.Course
	result := DB.Preload("Teacher").Find(&courses)
	if result.Error != nil {
		return nil, result.Error
	}
	return courses, nil
}

func GetCourseFromDB(id uuid.UUID) (*model.Course, error) {
	var course model.Course
	result := DB.Preload("Teacher").First(&course, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &course, nil
}

func UpdateCourseInDB(newCourse *model.Course) error {
	var course model.Course
	result := DB.First(&course, newCourse.Id)
	if result.Error != nil {
		return result.Error
	}
	result = DB.Save(newCourse)
	return result.Error
}

func DeleteCourseFromDB(id uuid.UUID) error {
	result := DB.Delete(&model.Course{}, id)
	return result.Error
}
