import React from "react";
import Combobox from "@/components/combobox/Combobox";
import Navbar from "@/components/navbar/Navbar";
import { Button, Input, Label } from "@/components/ui";
import { ICourse, IQuestion } from "@/shared/interfaces";
import { Plus } from "lucide-react";
import EditQuestion from "./question/EditQuestion";

const EditTest: React.FC = () => {
  const [questions, setQuestions] = React.useState<IQuestion[]>([]);
  const [courses, setCourses] = React.useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = React.useState<ICourse | null>(
    null
  );

  React.useEffect(() => {
    const mock: ICourse[] = [
      {
        id: "1",
        name: "Analiza matematyczna",
        teacher: "prof. Jan Kowalski",
      },
      {
        id: "2",
        name: "Algebra liniowa",
        teacher: "dr inż. Anna Nowak",
      },
    ];
    const mockQuestions: IQuestion[] = [
      {
        id: "1",
        body: "Czy 2+2=4?",
        imgFile: "",
        testId: "1",
        answers: [
          { id: "1", body: "Tak", valid: true, questionId: "1" },
          { id: "2", body: "Nie", valid: false, questionId: "1" },
        ],
      },
      {
        id: "2",
        body: "Czy 2+2=5?",
        imgFile: "",
        testId: "1",
        answers: [
          { id: "3", body: "Tak", valid: false, questionId: "2" },
          { id: "4", body: "Nie", valid: true, questionId: "2" },
        ],
      },
    ];
    setCourses(mock);
    setQuestions(mockQuestions);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-2 text-center">
          <div className="text-4xl">Edytuj testownik</div>
        </div>
        <div>
          <Label>Nazwa testownika</Label>
          <Input />
        </div>
        <div>
          <Label>Wybierz kurs</Label>
          <Combobox
            items={courses}
            selectedItem={selectedCourse}
            onItemSelected={setSelectedCourse}
            keyPath="id"
            valuePath="name"
          />
        </div>
        <div>
          <Label className="text-muted-foreground">Prowadzący</Label>
          <Input
            readOnly
            value={selectedCourse?.teacher ?? ""}
            placeholder="Wybierz kurs żeby zobaczyć prowadzącego"
          />
        </div>
        <div>
          <Label>Pytania</Label>
          <div className="grid gap-4">
            {questions.map((question, index) => (
              <EditQuestion
                key={question.id}
                index={index}
                question={question}
              />
            ))}
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-5 w-5" /> Dodaj nowe pytanie
        </Button>
      </main>
    </div>
  );
};

export default EditTest;
