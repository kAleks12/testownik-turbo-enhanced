import { IAnswear } from "./IAnswear";

export interface IQuestion {
  id: string;
  body?: string;
  imgFile?: string;
  testId: string;
  answers: IAnswear[];
}
