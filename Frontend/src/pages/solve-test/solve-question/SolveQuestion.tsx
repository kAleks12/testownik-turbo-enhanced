import React from "react";
import { shuffle } from "@/shared/utils/helpers";
import { ISolveQuestionProps } from "./ISolveQuestionProps";
import SolveAnswer from "../solve-answer/SolveAnswer";
import { Button } from "@/components/ui";
import { ArrowRight, Check } from "lucide-react";
import { IAnswerSolved } from "@/shared/interfaces";

const SolveQuestion = (props: ISolveQuestionProps) => {
  const { question, onNext, onSkip, leftToSolve, solvedCount } = props;
  const [answers, setAnswers] = React.useState<IAnswerSolved[]>([]);
  const [isRevealed, setIsRevealed] = React.useState(false);

  const handleShow = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    onNext(answers);
    setIsRevealed(false);
  };

  const handleSkip = () => {
    onSkip();
  };

  React.useEffect(() => {
    if (!question.answers) return;
    setAnswers(
      shuffle(
        question.answers.map((answer) => {
          return { selected: false, ...answer };
        })
      )
    );
  }, [question]);

  return (
    <div className="grid gap-4 transition ease-in-out delay-200">
      <div className="text-2xl md:text-3xl text-center">
        {question.body}
        <span className="text-muted-foreground">
          &nbsp;({solvedCount + 1}/{solvedCount + leftToSolve})
        </span>
      </div>
      <div>
        {question.imgFile && (
          <img
            src={question.imgFile}
            alt="question"
            className="w-full lg:w-1/2 m-auto rounded bg-white"
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        {answers.map((answer) => (
          <SolveAnswer key={answer.id} answer={answer} revealed={isRevealed} />
        ))}
      </div>
      <div className="flex gap-2">
        <div className="grow" />
        <Button variant={"secondary"} onClick={handleSkip}>
          Skip
        </Button>
        {isRevealed && (
          <Button onClick={handleNext} className="gap-1">
            Kolejne pytanie <ArrowRight className="h-5 w-5" />
          </Button>
        )}
        {!isRevealed && (
          <Button onClick={handleShow} className="gap-1">
            Sprawdź odpowiedzi <Check className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SolveQuestion;
