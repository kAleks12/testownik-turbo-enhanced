import { IAnswerSolved, IQuestion } from "@/shared/interfaces";

export interface ISolveQuestionProps {
  question: IQuestion;
  onNext: (selectedAnswers: IAnswerSolved[]) => void;
  onSkip: () => void;
  leftToSolve: number;
  solvedCount: number;
}
