import { ICourse } from "./ICourse";
import { IQuestion } from "./IQuestion";
import { ITestUpdate } from "./ITestUpdate";

export interface ITest extends ITestUpdate {
  id?: string;
  createdBy?: string;
  createdAt?: string;
  changedBy?: string;
  changedAt?: string;
  course?: ICourse;
  questions?: IQuestion[];
  questionSize?: number;
}
