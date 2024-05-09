import { ICourse } from "./ICourse";
import { IQuestion } from "./IQuestion";

export interface ITest {
  id?: string;
  name?: string;
  createdBy?: string;
  courseId?: string;
  createdAt?: string;
  changedBy?: string;
  changedAt?: string;
  course?: ICourse;
  schoolYear?: string;
  questions?: IQuestion[];
}
