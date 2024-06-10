import React from "react";
import { shuffle } from "@/shared/utils/helpers";
import { ISolveQuestionProps } from "./ISolveQuestionProps";
import SolveAnswear from "../solve-answear/SolveAnswear";
import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import { IAnswearSolved } from "@/shared/interfaces";

const SolveQuestion = (props: ISolveQuestionProps) => {
  const { question, onNext, onSkip } = props;
  const [answears, setAnswears] = React.useState<IAnswearSolved[]>([]);

  const [showAll, setShowAll] = React.useState(false);
  const [nextDisabled, setNextDisabled] = React.useState(false);

  const finish = (): Promise<void> => {
    return new Promise((resolve) => {
      setShowAll(true);
      setNextDisabled(true);
      setTimeout(() => {
        setShowAll(false);
        setNextDisabled(false);
        resolve();
      }, 2000);
    });
  };

  const handleNext = () => {
    finish().then(() => {
      onNext(answears);
    });
  };
  const handleSkip = () => {
    finish().then(() => {
      onSkip();
    });
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
      <div className="text-4xl text-center">{question.body}</div>
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
          <SolveAnswear key={answear.id} answear={answear} revealed={showAll} />
        ))}
      </div>
      <div className="flex gap-2">
        <div className="grow"></div>
        <Button
          variant={"secondary"}
          disabled={nextDisabled}
          onClick={handleSkip}
        >
          Skip
        </Button>
        <Button disabled={nextDisabled} onClick={handleNext}>
          Kolejne pytanie <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SolveQuestion;
