import { Button, LinkButton } from "@/components/ui";
import QuestionSummary from "../question-summary/QuestionSummary";
import { ITestSummaryProps } from "./ITestSummaryProps";

const TestSummary = (props: ITestSummaryProps) => {
  const { questions, solvedQuestions, onRefresh } = props;
  return (
    <div className="grid gap-4">
      {solvedQuestions.map((solvedQuestion, i) => (
        <QuestionSummary
          key={i}
          questionSolved={solvedQuestion}
          question={questions.find((x) => x.id === solvedQuestion.id)}
        />
      ))}
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="grow"></div>
        <LinkButton href="/home" variant="secondary">
          Wróć do widoku głównego
        </LinkButton>
        <Button onClick={onRefresh}>Rozwiąż test jeszcze raz</Button>
      </div>
    </div>
  );
};

export default TestSummary;
