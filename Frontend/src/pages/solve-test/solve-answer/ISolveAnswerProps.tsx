import { IAnswerSolved, IAnswer } from "@/shared/interfaces";

export interface ISolveAnswerProps {
  answer?: IAnswer;
  solvedAnswer?: IAnswerSolved;
  revealed?: boolean;
  small?: boolean;
}
