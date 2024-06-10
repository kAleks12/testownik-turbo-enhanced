import { Button, Input } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { IEditAnswearProps } from "./IEditAnswearProps";
import { Trash } from "lucide-react";
import Client from "@/api/Client";
import React from "react";

const EditAnswear = (props: IEditAnswearProps) => {
  const { answear: answearProps, onDeleted } = props;
  const [answear, setAnswear] = React.useState(answearProps);

  React.useEffect(() => {
    setAnswear(answearProps);
  }, [answearProps]);

  const handleBodyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswear({ ...answear, body: event.target.value });
  };

  const updateAnswear = () => {
    if (answear.id) {
      Client.Answears.putAnswear(answear.id, { ...answear });
    }
  };

  const handleValidChange = () => {
    setAnswear({ ...answear, valid: !answear.valid });
    if (answear.id) {
      Client.Answears.putAnswear(answear.id, {
        ...answear,
        valid: !answear.valid,
      });
    }
  };

  const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      Client.Answears.postAnswearImage(answear.id, file).then((response) => {
        setAnswear({ ...answear, imgFile: response.url });
      });
    }
  };

  const handleDeleteImg = () => {
    if (answear.id) {
      Client.Answears.deleteAnswearImage(answear.id).then(() => {
        setAnswear({ ...answear, imgFile: "" });
      });
    }
  };

  const handleDelete = () => {
    if (answear.id) {
      Client.Answears.deleteAnswear(answear.id).then(() => {
        onDeleted(answear.id);
      });
    }
  };
  return (
    <div className="flex flex-row content-center gap-3 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
      <Checkbox
        checked={answear.valid ?? false}
        onClick={handleValidChange}
        className="mt-3"
      />
      <div className="w-full gap-1">
        <Input
          value={answear.body ?? ""}
          onChange={handleBodyChange}
          onBlur={updateAnswear}
        />
        {answear.imgFile ? (
          <div className="flex flex-row mt-2">
            <img
              src={answear.imgFile}
              alt="answear"
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

export default EditAnswear;
