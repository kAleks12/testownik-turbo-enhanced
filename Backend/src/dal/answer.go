package dal

import (
	"github.com/gofrs/uuid"
	"src/model"
)

func AddAnswerToDB(answer *model.Answer) error {
	result := DB.Create(answer)
	return result.Error
}

func GetAnswersFromDB() ([]model.Answer, error) {
	var answers []model.Answer
	result := DB.Find(&answers)
	if result.Error != nil {
		return nil, result.Error
	}
	return answers, nil
}

func GetAnswerFromDB(id uuid.UUID) (*model.Answer, error) {
	var answer model.Answer
	result := DB.First(&answer, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &answer, nil
}

func UpdateAnswerInDB(newAnswer *model.Answer) error {
	var answer model.Answer
	result := DB.First(&answer, newAnswer.Id)
	if result.Error != nil {
		return result.Error
	}
	result = DB.Save(newAnswer)
	return result.Error
}

func DeleteAnswerFromDB(id uuid.UUID) error {
	result := DB.Delete(&model.Answer{}, id)
	return result.Error
}

func InsertImagePathToAnswerInDb(id uuid.UUID, imgFile string) error {
	var answer model.Answer
	result := DB.First(&answer, id)
	if result.Error != nil {
		return result.Error
	}
	answer.ImgFile = imgFile
	result = DB.Save(&answer)
	return result.Error
}

func ClearImagePathFromAnswerInDb(id uuid.UUID) error {
	var answer model.Answer
	result := DB.First(&answer, id)
	if result.Error != nil {
		return result.Error
	}
	answer.ImgFile = ""
	result = DB.Save(&answer)
	return result.Error
}
