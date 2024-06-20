import { Card, CardContent, CardHeader } from "@/components/ui";
import { IQuestionSummaryProps } from "./IQuestionSummaryProps";
import SolveAnswer from "../solve-answer/SolveAnswer";
import { IAnswerSolved } from "@/shared/interfaces";

const QuestionSummary = (props: IQuestionSummaryProps) => {
  const { question } = props;
  return (
    <Card>
      <CardHeader>
        <div className="text-lg">{question.body}</div>
        <div>
          {question.imgFile && (
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
          {question.answers.map((answer) => (
            <SolveAnswer
              key={answer.id}
              answer={answer as IAnswerSolved}
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
