import { cn } from "@/lib/utils";
import { LocalStorageElements, Theme } from "@/shared/enums";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui";
import LocalStorage from "@/shared/utils/LocalStorage";
import React from "react";

const ThemeButton = () => {
  const [theme, setTheme] = React.useState<Theme>(Theme.Light);

  React.useEffect(() => {
    let storedTheme = LocalStorage.getStoredValue<Theme>(
      LocalStorageElements.Theme
    );

    if (
      !storedTheme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      storedTheme = Theme.Dark;
    }
    setTheme(storedTheme ?? Theme.Light);
  }, []);

  const toggleTheme = () => {
    let newTheme;
    if (theme === Theme.Dark) {
      newTheme = Theme.Light;
    } else {
      newTheme = Theme.Dark;
    }
    document.documentElement.classList.toggle(Theme.Dark);
    LocalStorage.setStoredValue(LocalStorageElements.Theme, newTheme);
    setTheme(newTheme);
  };
  return (
    <div className="flex flex-row">
      <Button
        onClick={toggleTheme}
        variant="outline"
        className="flex flex-row rounded-full gap-1 p-0 h-fit hover:bg-background/80"
      >
        <div
          className={cn(
            "rounded-full p-1",
            theme === Theme.Light && "bg-primary"
          )}
        >
          <Sun className="h-4 w-4" />
        </div>
        <div
          className={cn(
            "rounded-full p-1",
            theme === Theme.Dark && "bg-primary"
          )}
        >
          <Moon className="h-4 w-4" />
        </div>
      </Button>
      <div className="ml-2 font-semibold content-center">
        {theme === Theme.Light ? "Jasny motyw" : "Ciemny motyw"}
      </div>
    </div>
  );
};

export default ThemeButton;
