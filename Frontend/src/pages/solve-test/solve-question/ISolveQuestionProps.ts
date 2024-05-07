import { IAnswearSolved, IQuestion } from "@/shared/interfaces";

export interface ISolveQuestionProps {
  question: IQuestion;
  onNext: (selectedAnswears: IAnswearSolved[]) => void;
  onSkip: () => void;
}
