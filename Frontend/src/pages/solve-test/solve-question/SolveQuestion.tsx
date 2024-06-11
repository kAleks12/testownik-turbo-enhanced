import React from "react";
import { shuffle } from "@/shared/utils/helpers";
import { ISolveQuestionProps } from "./ISolveQuestionProps";
import SolveAnswear from "../solve-answear/SolveAnswear";
import { Button } from "@/components/ui";
import { ArrowRight, Check } from "lucide-react";
import { IAnswearSolved } from "@/shared/interfaces";

const SolveQuestion = (props: ISolveQuestionProps) => {
  const { question, onNext, onSkip, repeatCount, solvedCount } = props;
  const [answears, setAnswears] = React.useState<IAnswearSolved[]>([]);
  const [isRevealed, setIsRevealed] = React.useState(false);

  const handleShow = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    onNext(answears);
    setIsRevealed(false);
  };

  const handleSkip = () => {
    onSkip();
  };

  React.useEffect(() => {
    if (!question.answers) return;
    setAnswears(
      shuffle(
        question.answers.map((answear) => {
          return { selected: false, ...answear };
        })
      )
    );
  }, [question]);

  return (
    <div className="grid gap-4 transition ease-in-out delay-200">
      <div className="text-2xl md:text-4xl text-center">
        {question.body}
        <span className="text-muted-foreground">
          &nbsp;({solvedCount}/{repeatCount})
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
        {answears.map((answear) => (
          <SolveAnswear 
            key={answear.id} 
            answear={answear} 
            revealed={isRevealed} 
          />
        ))}
      </div>
      <div className="flex gap-2">
        <div className="grow"/>
        <Button
          variant={"secondary"}
          onClick={handleSkip}
        >
          Skip
        </Button>
        {isRevealed && (
          <Button onClick={handleNext}>
          Kolejne pytanie <ArrowRight className="h-5 w-5" />
        </Button>)}
        {!isRevealed && (
          <Button onClick={handleShow}>
            Sprawdź odpowiedzi <Check className="h-5 w-5" />
          </Button>)}
      </div>
    </div>
  );
};

export default SolveQuestion;
