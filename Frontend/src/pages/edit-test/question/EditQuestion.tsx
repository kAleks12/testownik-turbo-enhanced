import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Label,
} from "@/components/ui";
import { Plus, Trash } from "lucide-react";
import { IEditQuestionProps } from "./IEditQuestionProps";
import EditAnswear from "./edit-answear/EditAnswear";
import { Textarea } from "@/components/ui/textarea";
import Client from "@/api/Client";

const EditQuestion = (props: IEditQuestionProps) => {
  const { question: questProps, index, onDeleted, onUpdated } = props;
  const [question, setQuestion] = React.useState(questProps);
  React.useEffect(() => {
    setQuestion(questProps);
  }, [questProps]);

  const handleDelete = () => {
    if (question.id) {
      Client.deleteQuestion(question.id).then(() => {
        onDeleted(question.id);
      });
    }
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion({ ...question, body: event.target.value });
  };

  const updateQuestion = () => {
    if (question.id) {
      Client.putQuestion(question.id, question).then(() => {
        onUpdated(question);
      });
    }
  };

  const handleAnswearDeleted = (answearId: string) => {
    setQuestion({
      ...question,
      answers: question.answers.filter((a) => a.id !== answearId),
    });
  };

  const handleAddAnswear = () => {
    if (question.id) {
      const newAnswear = { questionId: question.id, body: "", valid: false };
      Client.postAnswear(newAnswear).then((response) => {
        setQuestion({
          ...question,
          answers: [
            ...(question.answers ?? []),
            { ...newAnswear, id: response.id },
          ],
        });
      });
    }
  };

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      Client.postQuestionImage(question.id, file).then((response) => {
        setQuestion({ ...question, imgFile: response.url });
      });
    }
  };

  const handleDeleteImg = () => {
    if (question.id) {
      Client.deleteQuestionImage(question.id).then(() => {
        setQuestion({ ...question, imgFile: "" });
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div className="text-xl font-bold">Pytanie {index + 1}</div>
          <Button variant={"ghost"} onClick={handleDelete}>
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Treść pytania</Label>
          <Textarea
            value={question.body ?? ""}
            onChange={handleBodyChange}
            onBlur={updateQuestion}
          />
        </div>
        <div>
          <Label>Obrazek</Label>
          {question.imgFile ? (
            <div className="flex flex-row justify-center">
              <img src={question.imgFile} alt="question" className="w-1/2" />
              <Button variant={"ghost"} onClick={handleDeleteImg}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Input type="file" accept="image/*" onChange={handleImgChange} />
          )}
        </div>
        <div>
          <Label>Odpowiedzi</Label>
          <div className="grid gap-1">
            {question.answers.map((answear) => (
              <EditAnswear
                key={answear.id}
                answear={answear}
                onDeleted={handleAnswearDeleted}
              />
            ))}
          </div>
        </div>
        <div className="mt-2">
          <Button variant={"secondary"} onClick={handleAddAnswear}>
            <Plus />
            Dodaj odpowiedź
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditQuestion;
