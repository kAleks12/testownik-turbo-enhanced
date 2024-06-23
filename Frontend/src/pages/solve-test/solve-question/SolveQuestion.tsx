import React from "react";
import { shuffle } from "@/shared/utils/helpers";
import { ISolveQuestionProps } from "./ISolveQuestionProps";
import SolveAnswer from "../solve-answer/SolveAnswer";
import { Button } from "@/components/ui";
import { ArrowLeft, ArrowRight, Check, ChevronsRight } from "lucide-react";
import { IAnswerSolved } from "@/shared/interfaces";

const SolveQuestion = (props: ISolveQuestionProps) => {
  const {
    question,
    onNext,
    onSkip,
    onPrev,
    isPrevDisabled,
    leftToSolve,
    solvedCount,
  } = props;
  const [solvedAnswers, setAnswers] = React.useState<IAnswerSolved[]>([]);
  const [isRevealed, setIsRevealed] = React.useState(false);

  const handleShow = () => {
    setIsRevealed(true);
  };

  const handleNext = () => {
    onNext(solvedAnswers);
    setIsRevealed(false);
  };

  const handleSkip = () => {
    onSkip();
    setIsRevealed(false);
  };

  const handlePrev = () => {
    onPrev();
    setIsRevealed(false);
  };

  React.useEffect(() => {
    if (!question.answers) return;
    setAnswers(
      shuffle(
        question.answers.map((answer) => {
          return { id: answer.id, selected: false, valid: answer.valid };
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
        {solvedAnswers.map((solvedAnswer) => (
          <SolveAnswer
            key={solvedAnswer.id}
            answer={question.answers.find((x) => x.id === solvedAnswer.id)}
            solvedAnswer={solvedAnswer}
            revealed={isRevealed}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          variant={"secondary"}
          onClick={handlePrev}
          className="gap-1"
          disabled={isPrevDisabled}
        >
          <ArrowLeft className="h-5 w-5" />
          Poprzednie
        </Button>
        <div className="grow" />
        <div className="flex flex-col md:flex-row md:flex-row-reverse gap-2 items-end">
          {isRevealed ? (
            <Button onClick={handleNext} className="gap-1">
              Kolejne pytanie <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button onClick={handleShow} className="gap-1">
              Sprawdź odpowiedzi <Check className="h-5 w-5" />
            </Button>
          )}
          <Button variant={"secondary"} onClick={handleSkip} className="gap-1">
            Pomiń <ChevronsRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SolveQuestion;
