import { IQuestion } from "./IQuestion";

export interface ITest {
  id: string;
  name: string;
  createdBy: string;
  courseId: string;
  createdAt?: string;
  changedBy?: string;
  changedAt?: string;
  course?: {
    id: string;
    name: string;
    courseType: string;
    usosId: string;
    teacherId: string;
    teacher: {
      id: string;
      name: string;
      secondName: string;
      surname: string;
    };
  };
  schoolYear: string;
  questions?: IQuestion[];
}
