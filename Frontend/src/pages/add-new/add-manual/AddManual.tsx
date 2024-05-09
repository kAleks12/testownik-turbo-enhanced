import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Input,
  DialogFooter,
} from "@/components/ui";
import { IAddManualProps } from "./IAddManualProps";
import { ICourse, ITestUpdate } from "@/shared/interfaces";
import CourseSelector from "@/components/course-selector/CourseSelector";
import Client from "@/api/Client";
import { useNavigate } from "react-router-dom";

const AddManual = (props: IAddManualProps) => {
  const { courses } = props;
  const navigate = useNavigate();

  const [test, setTest] = React.useState<ITestUpdate>({
    name: "",
    courseId: "",
    schoolYear: "",
  });
  const [selectedCourse, setSelectedCourse] = React.useState<ICourse>();

  const handleTestNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTest({
      name: event.target.value,
      courseId: test?.courseId ?? "",
      schoolYear: test?.schoolYear ?? "",
    });
  };

  const handleSelectedCourseChange = (course: ICourse | undefined) => {
    if (course?.id !== test?.courseId && course?.id) {
      setTest({
        name: test?.name ?? "",
        courseId: course.id,
        schoolYear: test?.schoolYear ?? "",
      });
      setSelectedCourse(course);
    }
  };

  const handleTestYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTest({
      name: test?.name ?? "",
      courseId: test?.courseId ?? "",
      schoolYear: event.target.value,
    });
  };

  const isAddDisabled = (): boolean => {
    if (test?.courseId && test?.name) return false;
    return true;
  };

  const addTest = () => {
    Client.postTest(test).then((response) => {
      navigate(`/edit/${response.id}`);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Dodaj ręcznie</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowy testownik</DialogTitle>
          <DialogDescription>
            Uzupelnij poniższe dane przed dodawaniem pytań
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 md:gap-8 md:p-8">
          <div>
            <Label>Nazwa testownika</Label>
            <Input
              value={test?.name ?? ""}
              onChange={handleTestNameChange}
              required
            />
          </div>
          <CourseSelector
            courses={courses}
            selectedCourse={selectedCourse}
            setSelectedCourse={handleSelectedCourseChange}
          />
          <div>
            <Label>Semestr</Label>
            <Input
              value={test?.schoolYear ?? ""}
              onChange={handleTestYearChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isAddDisabled()} onClick={addTest}>
            Dodaj testownik
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddManual;
