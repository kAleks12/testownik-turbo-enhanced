import { IQuestion, IQuestionSolved } from "@/shared/interfaces";

export interface ITestSummaryProps {
  solvedQuestions: IQuestionSolved[];
  questions: IQuestion[];
  onRefresh: () => void;
}
