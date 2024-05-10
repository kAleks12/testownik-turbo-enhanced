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
      setAnswearStyle("bg-gray-300");
      answear.selected = true;
    } else {
      setAnswearStyle("");
      answear.selected = false;
    }
  };

  React.useEffect(() => {
    if (!revealed) {
      if (answear.selected) {
        setAnswearStyle("bg-gray-300");
        return;
      }
      setAnswearStyle("");
      return;
    }
    if (answear.valid) {
      if (answear.selected) {
        setAnswearStyle("bg-green-700");
        return;
      }
      setAnswearStyle("bg-green-500");
      return;
    }
    if (answear.selected && !answear.valid) {
      setAnswearStyle("bg-red-500");
      return;
    }
    setAnswearStyle("");
  }, [answear, revealed]);

  return (
    <div
      className={cn(
        "p-2 border border-gray-300 rounded-lg shadow-md transition ease-in-out delay-200",
        !small && "text-2xl p-4",
        answearStyle,
        !revealed && !answear.selected && "cursor-pointer hover:bg-gray-200"
      )}
      onClick={handleClick}
    >
      {answear.body}
    </div>
  );
};

export default SolveAnswear;
