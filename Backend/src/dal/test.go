package dal

import (
	"github.com/gofrs/uuid"
	"src/model"
)

func AddTestToDB(test *model.Test) error {
	result := DB.Create(test)
	return result.Error
}

func GetTestsFromDB() ([]model.Test, error) {
	var tests []model.Test
	result := DB.Preload("Course").
		Preload("Course.Teacher").
		Find(&tests)
	if result.Error != nil {
		return nil, result.Error
	}
	return tests, nil
}

func GetTestFromDB(id uuid.UUID) (*model.Test, error) {
	var test model.Test
	result := DB.Preload("Course").
		Preload("Course.Teacher").
		Preload("Questions").
		Preload("Questions.Answers").
		First(&test, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &test, nil
}

func UpdateTestInDB(newTest *model.Test) error {
	var test model.Test
	result := DB.First(&test, newTest.Id)
	if result.Error != nil {
		return result.Error
	}
	var changed = false
	if newTest.Name != test.Name {
		test.Name = newTest.Name
		changed = true
	}
	if newTest.CourseId != test.CourseId {
		test.CourseId = newTest.CourseId
		changed = true
	}
	if changed {
		test.ChangedBy = newTest.ChangedBy
		test.ChangedAt = newTest.ChangedAt
		result = DB.Save(&test)
		return result.Error
	}
	return nil
}

func DeleteTestFromDB(id uuid.UUID) error {
	result := DB.Delete(&model.Test{}, id)
	return result.Error
}
