import { IAnswearUpdate } from "./IAnswearUpdate";

export interface IQuestionUpdate {
  body: string;
  imgFile: string;
  testId: string;
  answers: IAnswearUpdate[];
}
