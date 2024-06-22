import { Card, CardContent, CardHeader } from "@/components/ui";
import { IQuestionSummaryProps } from "./IQuestionSummaryProps";
import SolveAnswer from "../solve-answer/SolveAnswer";

const QuestionSummary = (props: IQuestionSummaryProps) => {
  const { question, questionSolved } = props;
  return (
    <Card>
      <CardHeader>
        <div className="text-lg flex flex-col md:flex-row">
          {question?.body}
          {questionSolved.skipped && (
            <span className="flex-grow text-right text-muted-foreground text-sm md:text-base">
              &nbsp;Pominięto
            </span>
          )}
        </div>
        <div>
          {question?.imgFile && (
            <img
              src={question.imgFile}
              alt="question"
              className="lg:w-1/4 rounded bg-white"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          {question?.answers.map((answer) => (
            <SolveAnswer
              key={answer.id}
              answer={answer}
              solvedAnswer={questionSolved.answers.find(
                (x) => x.id === answer.id
              )}
              revealed
              small
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionSummary;
