import { Separator } from "@/components/ui/separator";
import { CircleUser } from "lucide-react";
import { Button } from "../../ui/button";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import ThemeButton from "./theme-button/ThemeButton";
import { Input, Label, Popover } from "@/components/ui";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

import styles from "./UserMenu.module.scss";
import { cn } from "@/lib/utils";
import React from "react";
import LocalStorage from "@/shared/utils/LocalStorage";
import { LocalStorageElements } from "@/shared/enums";
import { DEFAULT_QUESTION_COUNT } from "@/shared/utils/constants";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [repeatCount, setRepeatCount] = React.useState<number>(1);
  React.useEffect(() => {
    const storedCount = LocalStorage.getStoredValue<number>(
      LocalStorageElements.RepeatCount
    );
    setRepeatCount(storedCount ?? DEFAULT_QUESTION_COUNT);
  }, []);

  const setCount = (newCount: number) => {
    if (newCount < 1) return;
    LocalStorage.setStoredValue(LocalStorageElements.RepeatCount, newCount);
    setRepeatCount(newCount);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="z-50 min-w-[8rem] my-2 overflow-hidden rounded-md border bg-popover dark:bg-black p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      >
        <div className="flex flex-col gap-2 m-1">
          <Label className="text-center">
            {user?.firstName} {user?.lastName}
          </Label>
          <Separator />
          <div className="mx-auto px-2 group">
            <ThemeButton />
          </div>
          <div className="mx-auto px-2 group items-center justify-center">
            <Label>Ilość powtórzeń pytania</Label>
            <div className="flex gap-2 items-center justify-center">
              <Button
                variant="outline"
                className="p-2"
                disabled={repeatCount <= 1}
                onClick={() => setCount(repeatCount - 1)}
              >
                -
              </Button>
              <Input
                type="number"
                className={cn("w-16 max-w-fit text-center", styles.input)}
                min={1}
                value={repeatCount}
                onChange={(e) => setCount(parseInt(e.target.value))}
              />
              <Button
                variant="outline"
                className="p-2"
                onClick={() => setCount(repeatCount + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <Button variant="link" className="mx-auto" onClick={logout}>
            Wyloguj się
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
