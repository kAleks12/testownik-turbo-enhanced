import { IAnswear } from "./IAnswear";
import { IQuestionUpdate } from "./IQuestionUpdate";

export interface IQuestion extends IQuestionUpdate {
  id: string;
  answers: IAnswear[];
}
