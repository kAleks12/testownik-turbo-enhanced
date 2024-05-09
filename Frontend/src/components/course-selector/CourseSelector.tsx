import { ICourse } from "@/shared/interfaces";
import Combobox from "../combobox/Combobox";
import { Input, Label } from "../ui";
import { ICourseSelectorProps } from "./ICourseSelectorProps";

const CourseSelector = (props: ICourseSelectorProps) => {
  const { courses, selectedCourse, setSelectedCourse } = props;

  const getCourseString = (course: ICourse) => {
    return `${course.name} ${course.courseType} (${course.teacher.name} ${course.teacher.surname})`;
  };
  const getCourseHeader = (course: ICourse) => {
    return `${course.name} (${course.courseType})`;
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div>
        <Label>Wybierz kurs</Label>
        <Combobox
          items={courses}
          selectedItem={selectedCourse}
          onItemSelected={setSelectedCourse}
          keyPath="id"
          getItemValue={getCourseString}
          getSelectedItemHeader={getCourseHeader}
          required
        />
      </div>
      <div>
        <Label className="text-muted-foreground">Prowadzący</Label>
        <Input
          readOnly
          value={
            selectedCourse?.teacher
              ? `${selectedCourse.teacher.name} ${selectedCourse.teacher.surname}`
              : ""
          }
          placeholder="Wybierz kurs żeby zobaczyć prowadzącego"
        />
      </div>
    </div>
  );
};

export default CourseSelector;
