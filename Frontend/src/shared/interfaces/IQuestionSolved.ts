import { IAnswerSolved } from "./IAnswerSolved";

export interface IQuestionSolved {
  id: string;
  correct: boolean;
  skipped: boolean;
  answers: IAnswerSolved[];
}
