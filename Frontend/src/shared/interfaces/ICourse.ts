import { ITeacher } from "./ITeacher";

export interface ICourse {
  id: string;
  courseType: string;
  name: string;
  usosId: string;
  teacherId: string;
  teacher: ITeacher;
}
