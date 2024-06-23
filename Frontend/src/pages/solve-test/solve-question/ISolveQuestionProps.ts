import { IAnswerSolved, IQuestion } from "@/shared/interfaces";

export interface ISolveQuestionProps {
  question: IQuestion;
  onNext: (selectedAnswers: IAnswerSolved[]) => void;
  onSkip: () => void;
  onPrev: () => void;
  isPrevDisabled: boolean;
  leftToSolve: number;
  solvedCount: number;
}
