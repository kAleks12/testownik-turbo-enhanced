import React from "react";
import { ISolveAnswearProps } from "./ISolveAnswearProps";
import { cn } from "@/lib/utils";

const SolveAnswear = (props: ISolveAnswearProps) => {
  const { answear, revealed, small } = props;
  const [answearStyle, setAnswearStyle] = React.useState("");

  const handleClick = () => {
    if (revealed) {
      return;
    }
    if (!answear.selected) {
      setAnswearStyle("bg-gray-300 dark:bg-gray-700");
      answear.selected = true;
    } else {
      setAnswearStyle("");
      answear.selected = false;
    }
  };

  React.useEffect(() => {
    if (!revealed) {
      if (answear.selected) {
        setAnswearStyle("bg-gray-300 dark:bg-gray-700");
        return;
      }
      setAnswearStyle("");
      return;
    }
    if (answear.valid) {
      if (answear.selected) {
        setAnswearStyle("bg-green-600 dark:bg-green-900");
        return;
      }
      setAnswearStyle(
        "bg-green-500 border-2 border-red-500 dark:bg-green-800 dark:border-red-800"
      );
      return;
    }
    if (answear.selected && !answear.valid) {
      setAnswearStyle("bg-red-500 dark:bg-red-800");
      return;
    }
    setAnswearStyle("");
  }, [answear, revealed]);

  return (
    <div
      className={cn(
        "p-2 border border-gray-300 rounded-lg shadow-md transition ease-in-out delay-200",
        !small && "text-xl md:text-2xl p-4",
        answearStyle,
        !revealed &&
          !answear.selected &&
          "cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900"
      )}
      onClick={handleClick}
    >
      {answear.body}
      <div>
        {answear.imgFile && (
          <img
            src={answear.imgFile}
            alt="answear"
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

export default SolveAnswear;
