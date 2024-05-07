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
            <img src={question.imgFile} alt="question" className="w-1/4" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {question.answers.map((answear) => (
          <SolveAnswear
            key={answear.id}
            answear={answear as IAnswearSolved}
            revealed
            small
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionSummary;
