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
      Client.putAnswear(answear.id, { ...answear });
    }
  };

  const handleValidChange = () => {
    setAnswear({ ...answear, valid: !answear.valid });
    if (answear.id) {
      Client.putAnswear(answear.id, { ...answear, valid: !answear.valid });
    }
  };

  const handleDelete = () => {
    if (answear.id) {
      Client.deleteAnswear(answear.id).then(() => {
        onDeleted(answear.id);
      });
    }
  };
  return (
    <div className="flex flex-row content-center gap-3 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
      <Checkbox
        checked={answear.valid ?? false}
        onClick={handleValidChange}
        className="self-center"
      />
      <Input
        value={answear.body ?? ""}
        onChange={handleBodyChange}
        onBlur={updateAnswear}
      />
      <Button variant={"ghost"} onClick={handleDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditAnswear;
