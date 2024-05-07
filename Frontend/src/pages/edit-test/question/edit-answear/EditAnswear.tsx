import { Input } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { IEditAnswearProps } from "./IEditAnswearProps";

const EditAnswear = (props: IEditAnswearProps) => {
  const { answear } = props;

  return (
    <div className="flex flex-row content-center gap-3">
      <Checkbox defaultChecked={answear.valid} className="self-center" />
      <Input defaultValue={answear.body} />
    </div>
  );
};

export default EditAnswear;
