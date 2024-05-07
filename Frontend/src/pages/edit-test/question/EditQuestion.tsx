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

const EditQuestion = (props: IEditQuestionProps) => {
  const { question, index } = props;
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <div className="text-xl font-bold">Pytanie {index + 1}</div>
          <Button variant={"ghost"}>
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Treść pytania</Label>
          <Textarea defaultValue={question.body} />
        </div>
        <div>
          <Label>Obrazek</Label>
          <Input type="file" accept="image/*" />
        </div>
        <div>
          <Label>Odpowiedzi</Label>
          <div className="grid gap-1">
            {question.answers.map((answear) => (
              <EditAnswear key={answear.id} answear={answear} />
            ))}
          </div>
        </div>
        <div className="mt-2">
          <Button variant={"secondary"}>
            <Plus />
            Dodaj odpowiedź
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditQuestion;
