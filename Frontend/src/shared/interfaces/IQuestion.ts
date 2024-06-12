import { IAnswer } from "./IAnswer";
import { IQuestionUpdate } from "./IQuestionUpdate";

export interface IQuestion extends IQuestionUpdate {
  id: string;
  answers: IAnswer[];
}
