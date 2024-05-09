import { IQuestion } from "@/shared/interfaces";

export interface IEditQuestionProps {
  question: IQuestion;
  index: number;
  onDeleted: (id: string) => void;
}
