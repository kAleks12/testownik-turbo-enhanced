import { GraduationCap, Menu, Power } from "lucide-react";
import { Link, matchPath, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import UserSettings from "./user-settings/UserSettings";
import { useAuth } from "@/shared/hooks/auth/useAuth";

const Navbar = () => {
  const location = useLocation();
  const routes = ["/home", "/search", "/add-new", "/solve"];
  const baseRoute = routes.find((r) => matchPath(location.pathname, r));
  const { logout } = useAuth();
  const isSolveRoute = location.pathname.includes("/solve");

  const getTextForeground = (page: string) => {
    if (baseRoute === page) {
      return "text-foreground";
    }

    return "text-muted-foreground";
  };
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6 z-10">
      <nav className="hidden flex-col gap-6 text-lg font-medium lg:flex lg:flex-row lg:items-center lg:gap-5 lg:text-sm lg:gap-6">
        <Link to="/home">
          <GraduationCap />
        </Link>
        <Link
          to="/home"
          className={cn(
            getTextForeground("/home"),
            "transition-colors hover:text-foreground whitespace-nowrap"
          )}
        >
          Strona główna
        </Link>
        <Link
          to="/search"
          className={cn(
            getTextForeground("/search"),
            "transition-colors hover:text-foreground whitespace-nowrap"
          )}
        >
          Wyszukaj testownik
        </Link>
        <Link
          to="/add-new"
          className={cn(
            getTextForeground("/add-new"),
            "transition-colors hover:text-foreground whitespace-nowrap"
          )}
        >
          Dodaj testownik
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col gap-4 h-full">
            <nav className="grid gap-6 text-lg font-medium w-full">
              <GraduationCap />
              <Link
                to="/home"
                className={cn(
                  getTextForeground("/home"),
                  "transition-colors hover:text-foreground whitespace-nowrap"
                )}
              >
                Strona główna
              </Link>
              <Link
                to="/search"
                className={cn(
                  getTextForeground("/search"),
                  "transition-colors hover:text-foreground whitespace-nowrap"
                )}
              >
                Wyszukaj test
              </Link>
              <Link
                to="/add-new"
                className={cn(
                  getTextForeground("/add-new"),
                  "transition-colors hover:text-foreground whitespace-nowrap"
                )}
              >
                Dodaj test
              </Link>
            </nav>
            <div className="flex-grow" />
            <UserSettings isDuringSolveTest={!isSolveRoute} showButtonLabel />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 lg:ml-auto lg:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial"></div>
        <div className="hidden lg:flex">
          <UserSettings isDuringSolveTest={!isSolveRoute} />
        </div>
        <Button
          variant="ghost"
          onClick={logout}
          size="icon"
          className="rounded-full"
        >
          <Power />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
