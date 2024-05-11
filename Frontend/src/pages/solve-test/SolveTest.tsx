import React from "react";
import Navbar from "@/components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { IAnswearSolved, IQuestion, ITest } from "@/shared/interfaces";
import { deepCopy, shuffle } from "@/shared/utils/helpers";
import SolveQuestion from "./solve-question/SolveQuestion";
import QuestionSummary from "./question-summary/QuestionSummary";
import { Button, LinkButton } from "@/components/ui";
import Client from "@/api/Client";

const SolveTest: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [test, setTest] = React.useState<ITest>();
  const [questionsToSolve, setQuestionsToSolve] = React.useState<IQuestion[]>(
    []
  );
  const [solvedQuestions, setSolvedQuestions] = React.useState<IQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    React.useState<IQuestion | null>();

  React.useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const testData = await Client.getTest(id);
          console.log(testData);
          setTest(testData);
          setQuestionsToSolve(shuffle(testData.questions ?? []));
        } catch (error) {
          console.error("An error occurred while fetching tests:", error);
        }
      }
    };

    fetchData();
  }, [id]);

  React.useEffect(() => {
    setCurrentQuestion(
      questionsToSolve && questionsToSolve.length > 0
        ? questionsToSolve[0]
        : null
    );
  }, [questionsToSolve]);

  const finish = (answearsSolved?: IAnswearSolved[]) => {
    if (
      currentQuestion &&
      !solvedQuestions.some((question) => question.id === currentQuestion?.id)
    ) {
      const questionCpy = deepCopy(currentQuestion);
      if (answearsSolved) {
        questionCpy.answers = deepCopy(answearsSolved);
      }
      solvedQuestions.push(questionCpy);
    }

    currentQuestion?.answers.forEach(
      (answear) => ((answear as IAnswearSolved).selected = false)
    );
  };

  const handleNext = (answearsSolved: IAnswearSolved[]) => {
    const correct = answearsSolved.every((answear) => {
      return (
        (answear.valid && answear.selected) ||
        (!answear.valid && !answear.selected)
      );
    });
    finish(answearsSolved);
    if (correct) {
      setQuestionsToSolve((prev) => prev.slice(1));
    } else {
      setQuestionsToSolve((prev) => shuffle(prev));
    }
  };

  const handleSkip = () => {
    finish();
    setQuestionsToSolve((prev) => prev.slice(1));
  };

  const handleRefresh = () => {
    setQuestionsToSolve(shuffle(test?.questions || []));
    setSolvedQuestions([]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center">
          <div className="flex flex-row flex-grow gap-8 justify-between">
            <div className="grow" />
            <div className="font-semibold leading-none tracking-tight text-2xl ">
              {test?.name}
            </div>
            <div className="grow" />
            <div className="text-primary font-bold leading-none text-2xl">
              {test?.course?.name}&nbsp;({test?.course?.courseType})
            </div>
            <div className="grow" />
          </div>
        </div>
        {currentQuestion && (
          <SolveQuestion
            question={currentQuestion}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        )}
        {test?.questions?.length === solvedQuestions.length &&
          !currentQuestion && (
            <div className="grid gap-4">
              {solvedQuestions.map((question) => (
                <QuestionSummary key={question.id} question={question} />
              ))}
              <div className="flex flex-col md:flex-row gap-2">
                <div className="grow"></div>
                <LinkButton href="/home" variant="secondary">
                  Wróć do widoku głównego
                </LinkButton>
                <Button onClick={handleRefresh}>
                  Rozwiąż test jeszcze raz
                </Button>
              </div>
            </div>
          )}
      </main>
    </div>
  );
};

export default SolveTest;
