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
  const [totalNumberOfQuestions, setTotalNumberOfQuestions] =
    React.useState<number>(0);
  const [masteredQuestions, setMasteredQuestions] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [confirmProgressOpen, setConfirmProgressOpen] =
    React.useState<boolean>(false);
  const [repeatCount, setRepeatCount] = React.useState<number>(1);

  const setQuestions = (
    newQuestions: IQuestion[],
    countRepeat: number,
    testId?: string
  ) => {
    let questions: IQuestion[] = [];
    for (let i = 0; i < countRepeat; i++) {
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
    const count =
      LocalStorage.getStoredValue<number>(LocalStorageElements.RepeatCount) ??
      DEFAULT_QUESTION_COUNT;
    setRepeatCount(count);
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const testData = await Client.Tests.getTest(id);
          setTest(testData);
          setQuestions(testData.questions ?? [], repeatCount, testData.id);
        } catch (error) {
          console.error("An error occurred while fetching tests:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [id, repeatCount]);

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
    setTotalNumberOfQuestions(questionsToSolve.length + solvedQuestions.length);
  }, [currentQuestion, questionsToSolve, solvedQuestions]);

  const finish = (
    answersSolved?: IAnswerSolved[],
    skipped = false
  ): boolean => {
    if (counter < totalNumberOfQuestions) {
      setCounter(counter + 1);
    } else {
      LocalStorage.removeStoredItem(LocalStorageElements.Progress + test?.id);
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
      if (counter < totalNumberOfQuestions) {
        LocalStorage.setStoredValue<IQuestionSolved[]>(
          LocalStorageElements.Progress + test?.id,
          solvedQuestions
        );
      }
      return solvedQuestion.correct;
    }
    return false;
  };

  const handleNext = (answersSolved: IAnswerSolved[]) => {
    const correct = finish(answersSolved);
    if (correct) {
      if (leftToSolve === 1) {
        setMasteredQuestions(masteredQuestions + 1);
      }
      setQuestionsToSolve((prev) => prev.slice(1));
    } else {
      setQuestionsToSolve((prev) => shuffle(prev));
    }
  };

  const handleSkip = () => {
    finish([], true);
    if (leftToSolve === 1) {
      setMasteredQuestions(masteredQuestions + 1);
    }
    setQuestionsToSolve((prev) => prev.slice(1));
  };

  const handlePrev = () => {
    const lastSolvedQuestion = solvedQuestions[solvedQuestions.length - 1];
    const lastTestQuestion =
      test?.questions?.find((x) => x.id === lastSolvedQuestion.id) ?? null;

    if (lastTestQuestion) {
      if (lastSolvedQuestion.correct || lastSolvedQuestion.skipped) {
        if (
          !questionsToSolve.find((x) => x.id === lastTestQuestion.id) &&
          masteredQuestions > 0
        ) {
          setMasteredQuestions((prev) => prev - 1);
        }
      }
      setQuestionsToSolve((prev) => [lastTestQuestion, ...prev]);
    }
  };

  const handleRefresh = () => {
    setQuestions(shuffle(test?.questions ?? []), repeatCount);
    setSolvedQuestions([]);
    setCounter(1);
    setMasteredQuestions(0);
  };

  const onProgressLoad = () => {
    setConfirmProgressOpen(false);
    const progress = LocalStorage.getStoredValue<IQuestionSolved[]>(
      LocalStorageElements.Progress + test?.id
    );
    if (progress && progress.length > 0) {
      setSolvedQuestions(progress);
      setCounter(progress.length + 1);
      progress.forEach((question) => {
        if (question.skipped || question.correct) {
          const index = questionsToSolve.findIndex((x) => x.id === question.id);
          questionsToSolve.splice(index, 1);
        }
      });
      test?.questions?.forEach((question) => {
        if (
          progress.filter((x) => x.id === question.id).length === repeatCount
        ) {
          setMasteredQuestions((prev) => prev + 1);
        }
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <Progress value={(counter * 100) / totalNumberOfQuestions} />
      <div className="flex flex-row gap-2 md:gap-4 justify-end items-center mx-2 text-xs">
        <div className="flex flex-row">
          <p className="text-muted-foreground">
            Opanowane <p className="hidden md:inline-flex">pytania</p>:&nbsp;
          </p>
          <p>
            {masteredQuestions}/{test?.questions?.length ?? 0}
          </p>
        </div>
        <div className="flex flex-row">
          <p className="text-muted-foreground">
            Wszystkie <p className="hidden md:inline-flex">pytania</p>
            :&nbsp;
          </p>
          <p className="text-primary">
            {counter}/{totalNumberOfQuestions}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 lg:gap-8 mx-4 mb-4 md:mx-16 lg:mx-32">
        <div className="flex items-center justify-center text-center mt-2">
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
                onPrev={handlePrev}
                isPrevDisabled={counter === 1}
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
