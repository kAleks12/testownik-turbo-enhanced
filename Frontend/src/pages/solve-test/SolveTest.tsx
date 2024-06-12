import React from "react";
import Navbar from "@/components/navbar/Navbar";
import { useParams } from "react-router-dom";
import { IAnswerSolved, IQuestion, ITest } from "@/shared/interfaces";
import { deepCopy, shuffle } from "@/shared/utils/helpers";
import SolveQuestion from "./solve-question/SolveQuestion";
import QuestionSummary from "./question-summary/QuestionSummary";
import { Button, LinkButton, Progress } from "@/components/ui";
import Client from "@/api/Client";
import Loader from "@/components/loader/Loader";
import LocalStorage from "@/shared/utils/LocalStorage";
import { LocalStorageElements } from "@/shared/enums";
import { DEFAULT_QUESTION_COUNT } from "@/shared/utils/constants";

const SolveTest: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [test, setTest] = React.useState<ITest>();
  const [questionsToSolve, setQuestionsToSolve] = React.useState<IQuestion[]>(
    []
  );
  const [solvedQuestions, setSolvedQuestions] = React.useState<IQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] =
    React.useState<IQuestion | null>();
  const [counter, setCounter] = React.useState<number>(0);
  const [leftToSolve, setLeftToSolve] = React.useState<number>(0);
  const [solvedCount, setSolvedCount] = React.useState<number>(0);
  const [solvedIds, setSolvedIds] = React.useState<string[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const setQuestions = (newQuestions: IQuestion[]) => {
    const count =
      LocalStorage.getStoredValue<number>(LocalStorageElements.RepeatCount) ??
      DEFAULT_QUESTION_COUNT;
    let questions: IQuestion[] = [];
    setNumberOfQuestions((newQuestions?.length ?? 0) * count);
    for (let i = 0; i < count; i++) {
      questions = [...questions, ...(newQuestions ?? [])];
    }
    setQuestionsToSolve(shuffle(questions));
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const testData = await Client.Tests.getTest(id);
          console.log(testData);
          setTest(testData);
          setQuestions(testData.questions ?? []);
        } catch (error) {
          console.error("An error occurred while fetching tests:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  React.useEffect(() => {
    const newQuestion =
      questionsToSolve && questionsToSolve.length > 0
        ? questionsToSolve[0]
        : null;
    setCurrentQuestion(newQuestion);
  }, [questionsToSolve]);

  React.useEffect(() => {
    setSolvedCount(solvedIds.filter((x) => x === currentQuestion?.id).length);
    setLeftToSolve(
      questionsToSolve.filter((x) => x.id === currentQuestion?.id).length
    );
  }, [currentQuestion, questionsToSolve, solvedIds]);

  const finish = (answersSolved?: IAnswerSolved[]) => {
    if (
      currentQuestion &&
      !solvedQuestions.some((question) => question.id === currentQuestion?.id)
    ) {
      const questionCpy = deepCopy(currentQuestion);
      if (answersSolved) {
        questionCpy.answers = deepCopy(answersSolved);
      }
      solvedQuestions.push(questionCpy);
    }

    solvedIds.push(currentQuestion?.id || "");

    currentQuestion?.answers.forEach(
      (answer) => ((answer as IAnswerSolved).selected = false)
    );
  };

  const handleNext = (answersSolved: IAnswerSolved[]) => {
    const correct = answersSolved.every((answer) => {
      return (
        (answer.valid && answer.selected) || (!answer.valid && !answer.selected)
      );
    });
    finish(answersSolved);
    if (correct) {
      setQuestionsToSolve((prev) => prev.slice(1));
      setCounter(counter + 1);
    } else {
      setQuestionsToSolve((prev) => shuffle(prev));
    }
  };

  const handleSkip = () => {
    finish();
    setCounter(counter + 1);
    setQuestionsToSolve((prev) => prev.slice(1));
  };

  const handleRefresh = () => {
    setQuestions(shuffle(test?.questions ?? []));
    setSolvedQuestions([]);
    setSolvedIds([]);
    setCounter(0);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <Progress value={(counter * 100) / numberOfQuestions} />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-8 lg:p-8">
        <div className="flex items-center justify-center text-center">
          <div className="flex flex-col lg:flex-row flex-grow gap-2 lg:gap-8 justify-between">
            <div className="grow" />
            <div className="font-semibold leading-none tracking-tight text-xl md:text-2xl ">
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
            leftToSolve={leftToSolve}
            solvedCount={solvedCount}
          />
        )}
        {test?.questions?.length === solvedQuestions.length &&
          !currentQuestion && (
            <div className="grid gap-4">
              {solvedQuestions.map((question) => (
                <QuestionSummary key={question.id} question={question} />
              ))}
              <div className="flex flex-col lg:flex-row gap-2">
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
      <Loader isLoading={isLoading} />
    </div>
  );
};

export default SolveTest;
