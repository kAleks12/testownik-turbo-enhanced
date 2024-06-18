package dal

import (
	"github.com/gofrs/uuid"
	"src/model"
)

func AddQuestionToDB(question *model.Question) error {
	result := DB.Create(question)
	return result.Error
}

func GetQuestionsFromDB() ([]model.Question, error) {
	var questions []model.Question
	result := DB.Find(&questions)
	if result.Error != nil {
		return nil, result.Error
	}
	return questions, nil
}

func GetQuestionFromDB(id uuid.UUID) (*model.Question, error) {
	var question model.Question
	result := DB.Preload("Answers").First(&question, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &question, nil
}

func UpdateQuestionInDB(newQuestion *model.Question) error {
	var Question model.Question
	result := DB.First(&Question, newQuestion.Id)
	if result.Error != nil {
		return result.Error
	}
	result = DB.Save(newQuestion)
	return result.Error
}
func InsertImagePathToQuestionInDb(id uuid.UUID, imgFile string) error {
	var question model.Question
	result := DB.First(&question, id)
	if result.Error != nil {
		return result.Error
	}
	question.ImgFile = imgFile
	result = DB.Save(&question)
	return result.Error
}

func ClearImagePathFromQuestionInDb(id uuid.UUID) error {
	var question model.Question
	result := DB.First(&question, id)
	if result.Error != nil {
		return result.Error
	}
	question.ImgFile = ""
	result = DB.Save(&question)
	return result.Error
}

func DeleteQuestionFromDB(id uuid.UUID) error {
	result := DB.Delete(&model.Question{}, id)
	return result.Error
}

func GetCountForTest(testId uuid.UUID) int64 {
	var count int64
	result := DB.Model(&model.Question{}).Where("test_id = ?", testId).Count(&count)
	if result.Error != nil {
		return 0
	}
	return count
}
