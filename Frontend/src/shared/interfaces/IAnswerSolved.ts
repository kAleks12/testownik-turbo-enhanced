import { IAnswer } from "./IAnswer";

export interface IAnswerSolved extends IAnswer {
  selected: boolean;
}
