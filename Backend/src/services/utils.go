package services

import (
	"github.com/gofrs/uuid"
	"src/model"
	"src/model/dto"
)

func createNewQuestion(question dto.SubQuestion, testId uuid.UUID) model.Question {
	questionId, _ := uuid.NewV4()
	return model.Question{
		Id:      questionId,
		Body:    question.Body,
		ImgFile: question.ImgFile,
		TestId:  testId,
	}
}

func createNewAnswer(answer dto.SubAnswer, questionId uuid.UUID) model.Answer {
	answerId, _ := uuid.NewV4()
	return model.Answer{
		Id:         answerId,
		Body:       answer.Body,
		Valid:      answer.Valid,
		QuestionId: questionId,
	}
}

func containsAnswer(answers []model.Answer, answer model.Answer) bool {
	for _, a := range answers {
		if a.Id == answer.Id {
			return true
		}
	}
	return false
}
