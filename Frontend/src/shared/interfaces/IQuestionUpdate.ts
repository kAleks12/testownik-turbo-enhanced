import { IAnswerUpdate } from "./IAnswerUpdate";

export interface IQuestionUpdate {
  body: string;
  imgFile: string;
  testId: string;
  answers: IAnswerUpdate[];
}
