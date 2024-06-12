import { IAnswerSolved } from "@/shared/interfaces";

export interface ISolveAnswerProps {
  answer: IAnswerSolved;
  revealed?: boolean;
  small?: boolean;
}
