import { IAnswer } from "@/shared/interfaces";

export interface IEditAnswerProps {
  answer: IAnswer;
  onDeleted: (id: string) => void;
}
