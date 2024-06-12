import { Button, Input } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { IEditAnswerProps } from "./IEditAnswerProps";
import { Trash } from "lucide-react";
import Client from "@/api/Client";
import React from "react";

const EditAnswer = (props: IEditAnswerProps) => {
  const { answer: answerProps, onDeleted } = props;
  const [answer, setAnswer] = React.useState(answerProps);

  React.useEffect(() => {
    setAnswer(answerProps);
  }, [answerProps]);

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer({ ...answer, body: event.target.value });
  };

  const updateAnswer = () => {
    if (answer.id) {
      Client.Answers.putAnswer(answer.id, { ...answer });
    }
  };

  const handleValidChange = () => {
    setAnswer({ ...answer, valid: !answer.valid });
    if (answer.id) {
      Client.Answers.putAnswer(answer.id, {
        ...answer,
        valid: !answer.valid,
      });
    }
  };

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      Client.Answers.postAnswerImage(answer.id, file).then((response) => {
        setAnswer({ ...answer, imgFile: response.url });
      });
    }
  };

  const handleDeleteImg = () => {
    if (answer.id) {
      Client.Answers.deleteAnswerImage(answer.id).then(() => {
        setAnswer({ ...answer, imgFile: "" });
      });
    }
  };

  const handleDelete = () => {
    if (answer.id) {
      Client.Answers.deleteAnswer(answer.id).then(() => {
        onDeleted(answer.id);
      });
    }
  };
  return (
    <div className="flex flex-row content-center gap-3 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
      <Checkbox
        checked={answer.valid ?? false}
        onClick={handleValidChange}
        className="mt-3"
      />
      <div className="w-full gap-1">
        <Input
          value={answer.body ?? ""}
          onChange={handleBodyChange}
          onBlur={updateAnswer}
        />
        {answer.imgFile ? (
          <div className="flex flex-row mt-2">
            <img
              src={answer.imgFile}
              alt="answer"
              className="max-w-[550px] rounded bg-white"
            />
            <Button variant={"ghost"} onClick={handleDeleteImg}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Input type="file" accept="image/*" onChange={handleImgChange} />
        )}
      </div>
      <Button variant={"ghost"} onClick={handleDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditAnswer;
