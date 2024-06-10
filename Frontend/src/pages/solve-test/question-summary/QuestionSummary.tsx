import { Card, CardContent, CardHeader } from "@/components/ui";
import { IQuestionSummaryProps } from "./IQuestionSummaryProps";
import SolveAnswear from "../solve-answear/SolveAnswear";
import { IAnswearSolved } from "@/shared/interfaces";

const QuestionSummary = (props: IQuestionSummaryProps) => {
  const { question } = props;
  return (
    <Card>
      <CardHeader>
        <div>{question.body}</div>
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
          {question.answers.map((answear) => (
            <SolveAnswear
              key={answear.id}
              answear={answear as IAnswearSolved}
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
