import React from "react";
import { ISolveAnswerProps } from "./ISolveAnswerProps";
import { cn } from "@/lib/utils";

const SolveAnswer = (props: ISolveAnswerProps) => {
  const { answer, revealed, small } = props;
  const [answerStyle, setAnswerStyle] = React.useState("");

  const handleClick = () => {
    if (revealed) {
      return;
    }
    if (!answer.selected) {
      setAnswerStyle("bg-gray-300 dark:bg-gray-700");
      answer.selected = true;
    } else {
      setAnswerStyle("");
      answer.selected = false;
    }
  };

  React.useEffect(() => {
    if (!revealed) {
      if (answer.selected) {
        setAnswerStyle("bg-gray-300 dark:bg-gray-700");
        return;
      }
      setAnswerStyle("");
      return;
    }
    if (answer.valid) {
      if (answer.selected) {
        setAnswerStyle("bg-green-600 dark:bg-green-900");
        return;
      }
      setAnswerStyle(
        "bg-green-500 border-2 border-red-500 dark:bg-green-800 dark:border-red-800"
      );
      return;
    }
    if (answer.selected && !answer.valid) {
      setAnswerStyle("bg-red-500 dark:bg-red-800");
      return;
    }
    setAnswerStyle("");
  }, [answer, revealed]);

  return (
    <div
      className={cn(
        "p-2 border border-gray-300 rounded-lg shadow-md transition ease-in-out delay-200",
        !small && "text-lg md:text-xl p-4",
        answerStyle,
        !revealed &&
          !answer.selected &&
          "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900"
      )}
      onClick={handleClick}
    >
      {answer.body}
      <div>
        {answer.imgFile && (
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
