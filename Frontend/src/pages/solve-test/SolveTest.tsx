import React from "react";
import Navbar from "@/components/navbar/Navbar";
import { useParams } from "react-router-dom";
import {
  IAnswerSolved,
  IQuestion,
  IQuestionSolved,
  ITest,
} from "@/shared/interfaces";
import { shuffle } from "@/shared/utils/helpers";
import SolveQuestion from "./solve-question/SolveQuestion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Progress,
} from "@/components/ui";
import Client from "@/api/Client";
import Loader from "@/components/loader/Loader";
import LocalStorage from "@/shared/utils/LocalStorage";
import { LocalStorageElements } from "@/shared/enums";
import { DEFAULT_QUESTION_COUNT } from "@/shared/utils/constants";
import TestSummary from "./test-summary/TestSummary";
import ProgressPopup from "./progress-popup/ProgressPopup";

const SolveTest: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [test, setTest] = React.useState<ITest>();
  const [questionsToSolve, setQuestionsToSolve] = React.useState<IQuestion[]>(
    []
  );
  const [solvedQuestions, setSolvedQuestions] = React.useState<
    IQuestionSolved[]
  >([]);
  const [currentQuestion, setCurrentQuestion] =
    React.useState<IQuestion | null>();
  const [counter, setCounter] = React.useState<number>(1);
  const [leftToSolve, setLeftToSolve] = React.useState<number>(0);
  const [solvedCount, setSolvedCount] = React.useState<number>(0);
  const [numberOfQuestions, setNumberOfQuestions] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [confirmProgressOpen, setConfirmProgressOpen] =
    React.useState<boolean>(false);

  const setQuestions = (newQuestions: IQuestion[], testId?: string) => {
    const count =
      LocalStorage.getStoredValue<number>(LocalStorageElements.RepeatCount) ??
      DEFAULT_QUESTION_COUNT;
    let questions: IQuestion[] = [];
    setNumberOfQuestions((newQuestions?.length ?? 0) * count);
    for (let i = 0; i < count; i++) {
      questions = [...questions, ...(newQuestions ?? [])];
    }
    setQuestionsToSolve(shuffle(questions));
    if (testId) {
      const progress = LocalStorage.getStoredValue<IQuestionSolved[]>(
        LocalStorageElements.Progress + testId
      );
      if (progress && progress.length > 0) {
        setConfirmProgressOpen(true);
      }
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const testData = await Client.Tests.getTest(id);
          console.log(testData);
          setTest(testData);
          setQuestions(testData.questions ?? [], testData.id);
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
    setSolvedCount(
      solvedQuestions.filter((x) => x.id === currentQuestion?.id).length
    );
    setLeftToSolve(
      questionsToSolve.filter((x) => x.id === currentQuestion?.id).length
    );
  }, [currentQuestion, questionsToSolve, solvedQuestions]);

  const finish = (
    answersSolved?: IAnswerSolved[],
    skipped = false
  ): boolean => {
    if (counter !== numberOfQuestions) {
      setCounter(counter + 1);
    }
    if (currentQuestion) {
      const solvedQuestion: IQuestionSolved = {
        id: currentQuestion.id,
        correct:
          answersSolved?.every(
            (answer) =>
              (answer.valid && answer.selected) ||
              (!answer.valid && !answer.selected)
          ) ?? false,
        skipped: skipped,
        answers: answersSolved || [],
      };

      solvedQuestions.push(solvedQuestion);
      LocalStorage.setStoredValue<IQuestionSolved[]>(
        LocalStorageElements.Progress + test?.id,
        solvedQuestions
      );
      return solvedQuestion.correct;
    }
    return false;
  };

  const handleNext = (answersSolved: IAnswerSolved[]) => {
    const correct = finish(answersSolved);
    if (correct) {
      setQuestionsToSolve((prev) => prev.slice(1));
    } else {
      setQuestionsToSolve((prev) => shuffle(prev));
      setNumberOfQuestions((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    finish([], true);
    setQuestionsToSolve((prev) => prev.slice(1));
  };

  const handleRefresh = () => {
    setQuestions(shuffle(test?.questions ?? []));
    setSolvedQuestions([]);
    setCounter(1);
  };

  const onProgressLoad = () => {
    setConfirmProgressOpen(false);
    const progress = LocalStorage.getStoredValue<IQuestionSolved[]>(
      LocalStorageElements.Progress + test?.id
    );
    if (progress && progress.length > 0) {
      setSolvedQuestions(progress);
      setCounter(progress.length + 1);
      let wrongCount = 0;
      progress.forEach((question) => {
        if (question.skipped || question.correct) {
          const index = questionsToSolve.findIndex((x) => x.id === question.id);
          questionsToSolve.splice(index, 1);
        }
        if (!question.skipped && !question.correct) {
          wrongCount++;
        }
      });
      setNumberOfQuestions(numberOfQuestions + wrongCount);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <Progress value={(counter * 100) / numberOfQuestions} />
      <div className="flex flex-col items-end mx-2">
        <p className="text-primary text-xs md:text-sm">
          {counter}/{numberOfQuestions}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4 lg:gap-8 mx-4 mb-4 md:mx-16 lg:mx-32">
        <div className="flex items-center justify-center text-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home">Strona główna</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/search?course=${test?.course?.name}`}>
                  {test?.course?.name}&nbsp;({test?.course?.courseType})
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{test?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {test?.questions && test.questions.length !== 0 && (
          <>
            {currentQuestion ? (
              <SolveQuestion
                question={currentQuestion}
                onNext={handleNext}
                onSkip={handleSkip}
                leftToSolve={leftToSolve}
                solvedCount={solvedCount}
              />
            ) : (
              <TestSummary
                questions={test?.questions ?? []}
                solvedQuestions={solvedQuestions}
                onRefresh={handleRefresh}
              />
            )}
          </>
        )}
      </div>
      <Loader isLoading={isLoading} />
      <ProgressPopup open={confirmProgressOpen} onConfirm={onProgressLoad} />
    </div>
  );
};

export default SolveTest;
