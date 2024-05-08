package dal

import (
	"github.com/gofrs/uuid"
	"src/model"
)

func AddTeacherToDB(teacher *model.Teacher) error {
	result := DB.Create(teacher)
	return result.Error
}

func GetTeachersFromDB() ([]model.Teacher, error) {
	var teachers []model.Teacher
	result := DB.Find(&teachers)
	if result.Error != nil {
		return nil, result.Error
	}
	return teachers, nil
}

func GetTeacherByUniqueKey(firstName string, lastName string, secondName string) (*model.Teacher, error) {
	var teacher model.Teacher
	result := DB.
		Where("name = ? AND surname = ? AND second_name = ?", firstName, lastName, secondName).
		First(&teacher)
	if result.Error != nil {
		return nil, result.Error
	}
	return &teacher, nil
}

//make teacher optional

func GetTeacherFromDB(id uuid.UUID) (*model.Teacher, error) {
	var teacher model.Teacher
	result := DB.First(&teacher, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &teacher, nil
}

func UpdateTeacherInDB(newTeacher *model.Teacher) error {
	var teacher model.Teacher
	result := DB.First(&teacher, newTeacher.Id)
	if result.Error != nil {
		return result.Error
	}
	result = DB.Save(newTeacher)
	return result.Error
}

func DeleteTeacherFromDB(id uuid.UUID) error {
	result := DB.Delete(&model.Teacher{}, id)
	return result.Error
}
