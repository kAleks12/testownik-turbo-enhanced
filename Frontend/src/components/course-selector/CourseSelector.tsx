import { ICourse } from "@/shared/interfaces";
import { Input, Label } from "../ui";
import { ICourseSelectorProps } from "./ICourseSelectorProps";
import { nameof } from "ts-simple-nameof";
import Combobox from "../combobox/Combobox";

const CourseSelector = (props: ICourseSelectorProps) => {
  const { courses, selectedCourse, setSelectedCourse, dropdownWidth } = props;

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
          keyPath={nameof<ICourse>((c) => c.id)}
          getItemValue={getCourseString}
          getSelectedItemHeader={getCourseHeader}
          groupPath={nameof<ICourse>((c) => c.active)}
          groups={[
            { groupValue: true, header: "Aktualne kursy" },
            {
              groupValue: false,
              header: "Pozostałe istniejące wśród testowników",
            },
          ]}
          dropdownWidth={dropdownWidth}
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
