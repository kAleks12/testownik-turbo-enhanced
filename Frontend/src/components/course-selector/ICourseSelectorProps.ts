import { ICourse } from "@/shared/interfaces";

export interface ICourseSelectorProps {
  selectedCourse: ICourse | undefined;
  setSelectedCourse: (course: ICourse | undefined) => void;
  courses: ICourse[];
  dropdownWidth?: string;
}
