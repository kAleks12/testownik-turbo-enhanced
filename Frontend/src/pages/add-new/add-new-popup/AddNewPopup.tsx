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
  HoverCardContent,
  HoverCard,
  HoverCardTrigger,
} from "@/components/ui";
import { IAddNewPopupProps } from "./IAddNewPopupProps";
import { ICourse, ITestUpdate } from "@/shared/interfaces";
import CourseSelector from "@/components/course-selector/CourseSelector";
import Client from "@/api/Client";
import { useNavigate } from "react-router-dom";
import styles from "./AddNewPopup.module.scss";
import { cn } from "@/lib/utils";

const AddNewPopup = (props: IAddNewPopupProps) => {
  const { courses, manual } = props;
  const navigate = useNavigate();

  const [test, setTest] = React.useState<ITestUpdate>({
    name: "",
    courseId: "",
    schoolYear: "",
  });
  const [zipFile, setZipFile] = React.useState<File | undefined>();
  const [selectedCourse, setSelectedCourse] = React.useState<ICourse>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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
    if (!isLoading && test?.courseId && test?.name && (manual || zipFile))
      return false;
    return true;
  };

  const addTest = () => {
    setIsLoading(true);
    if (manual) {
      Client.postTest(test).then((response) => {
        setIsLoading(false);
        navigate(`/edit/${response.id}`);
      });
    } else if (zipFile) {
      Client.postTestZipFile(test, zipFile).then((response) => {
        setIsLoading(false);
        navigate(`/edit/${response.id}`);
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{manual ? "Dodaj ręcznie" : "Dodaj z pliku"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowy testownik</DialogTitle>
          {manual && (
            <DialogDescription>
              Uzupełnij poniższe dane przed dodawaniem pytań
            </DialogDescription>
          )}
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
            dropdownWidth="400px"
          />
          <div>
            <Label>Semestr</Label>
            <Input
              value={test?.schoolYear ?? ""}
              onChange={handleTestYearChange}
            />
          </div>
          {!manual && (
            <div>
              <Label>Wybierz plik zip</Label>
              <HoverCard>
                <HoverCardTrigger>
                  <Input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setZipFile(e.target.files?.[0])}
                    required
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-full">
                  <p>
                    Plik .zip powinien zawierać folder z pytaniami w pliku .txt
                    w formacie:
                  </p>
                  <div
                    className={cn(styles.fileStyleContainer, "text-sm gap-x-1")}
                  >
                    <p className="text-muted-foreground text-xs pt-1">1:</p>
                    <div className="grid grid-cols-4 grid-rows-2 gap-1 justify-items-center rounded-t bg-gray-300 dark:bg-gray-800">
                      <p>X</p>
                      <p>1</p>
                      <p>0</p>
                      <p>(1 lub 0)...</p>
                      <p className="text-muted-foreground text-xs">
                        (Oznaczenie linii pytania)
                      </p>
                      <p className="text-muted-foreground text-xs">
                        (Oznaczenie poprawnej odpowiedzi)
                      </p>
                      <p className="text-muted-foreground text-xs">
                        (Oznaczenie niepoprawnej odpowiedzi)
                      </p>
                      <p className="text-muted-foreground text-xs">
                        (itd. dla kolejnych odpowiedzi)
                      </p>
                    </div>
                    <p className="text-muted-foreground text-xs">2:</p>
                    <p className="pl-8 bg-gray-300 dark:bg-gray-800">
                      Treść pytania
                    </p>
                    <p className="text-muted-foreground text-xs">3:</p>
                    <p className="pl-8 bg-gray-300 dark:bg-gray-800">
                      Odpowiedź A
                    </p>
                    <p className="text-muted-foreground text-xs">4:</p>
                    <p className="pl-8 bg-gray-300 dark:bg-gray-800">
                      Odpowiedź B
                    </p>
                    <p className="text-muted-foreground text-xs">5:</p>
                    <p className="pl-8 pb-1 rounded-b bg-gray-300 dark:bg-gray-800">
                      ...
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>Obrazki do pytania mogą być zdefiniowane wg wzoru </p>
                    <div className="flex flex-row gap-1">
                      &#x2022;
                      <p className="italic">[nazwa_pliku_txt_pytania].png</p> -
                      dla dodania obrazka do pytania
                      <p className="text-muted-foreground italic">
                        (np. 0001.png)
                      </p>
                    </div>
                    <div className="flex flex-row gap-1">
                      &#x2022;
                      <p className="italic">
                        [nazwa_pliku_txt_pytania][A/B/C/...].png
                      </p>
                      - dla dodania obrazka do odpowiedzi
                      <p className="text-muted-foreground italic">
                        (np. 0001A.jpg)
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
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

export default AddNewPopup;
