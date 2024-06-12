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
import EditAnswer from "./edit-answer/EditAnswer";
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
      Client.Questions.deleteQuestion(question.id).then(() => {
        onDeleted(question.id);
      });
    }
  };

  const handleBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion({ ...question, body: event.target.value });
  };

  const updateQuestion = () => {
    if (question.id) {
      Client.Questions.putQuestion(question.id, {
        ...question,
        answers: [],
      }).then(() => {
        onUpdated(question);
      });
    }
  };

  const handleAnswerDeleted = (answerId: string) => {
    setQuestion({
      ...question,
      answers: question.answers.filter((a) => a.id !== answerId),
    });
  };

  const handleAddAnswer = () => {
    if (question.id) {
      const newAnswer = {
        questionId: question.id,
        body: "",
        imgFile: "",
        valid: false,
      };
      Client.Answers.postAnswer(newAnswer).then((response) => {
        setQuestion({
          ...question,
          answers: [
            ...(question.answers ?? []),
            { ...newAnswer, id: response.id },
          ],
        });
      });
    }
  };

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      Client.Questions.postQuestionImage(question.id, file).then((response) => {
        setQuestion({ ...question, imgFile: response.url });
      });
    }
  };

  const handleDeleteImg = () => {
    if (question.id) {
      Client.Questions.deleteQuestionImage(question.id).then(() => {
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
              <img
                src={question.imgFile}
                alt="question"
                className="lg:w-1/2 rounded bg-white"
              />
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
            {question.answers.map((answer) => (
              <EditAnswer
                key={answer.id}
                answer={answer}
                onDeleted={handleAnswerDeleted}
              />
            ))}
          </div>
        </div>
        <div className="mt-2">
          <Button variant={"secondary"} onClick={handleAddAnswer}>
            <Plus />
            Dodaj odpowiedź
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditQuestion;
