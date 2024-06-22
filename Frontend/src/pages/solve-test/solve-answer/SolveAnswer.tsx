import React from "react";
import { ISolveAnswerProps } from "./ISolveAnswerProps";
import { cn } from "@/lib/utils";

const SolveAnswer = (props: ISolveAnswerProps) => {
  const { solvedAnswer, answer, revealed, small } = props;
  const [answerStyle, setAnswerStyle] = React.useState("");

  const handleClick = () => {
    if (revealed || !solvedAnswer) {
      return;
    }
    if (!solvedAnswer.selected) {
      setAnswerStyle("bg-gray-300 dark:bg-gray-700");
      solvedAnswer.selected = true;
    } else {
      setAnswerStyle("");
      solvedAnswer.selected = false;
    }
  };

  React.useEffect(() => {
    if (!revealed) {
      if (solvedAnswer?.selected) {
        setAnswerStyle("bg-gray-300 dark:bg-gray-700");
        return;
      }
      setAnswerStyle("");
      return;
    }
    if (solvedAnswer?.valid) {
      if (solvedAnswer?.selected) {
        setAnswerStyle("bg-green-600 dark:bg-green-900");
        return;
      }
      setAnswerStyle(
        "bg-green-500 border-2 border-red-500 dark:bg-green-800 dark:border-red-800"
      );
      return;
    }
    if (solvedAnswer?.selected && !solvedAnswer?.valid) {
      setAnswerStyle("bg-red-500 dark:bg-red-800");
      return;
    }
    setAnswerStyle("");
  }, [solvedAnswer, revealed]);

  return (
    <div
      className={cn(
        "p-2 border border-gray-300 rounded-lg shadow-md transition ease-in-out delay-200",
        !small && "text-lg md:text-xl p-4",
        answerStyle,
        !revealed &&
          !solvedAnswer?.selected &&
          "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900"
      )}
      onClick={handleClick}
    >
      {answer?.body}
      <div>
        {answer?.imgFile && (
          <img
            src={answer.imgFile}
            alt="answer"
            className={cn(
              small ? "md: w-1/2 lg:w-1/4" : "max-w-[550px] m-auto",
              "rounded bg-white"
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SolveAnswer;
