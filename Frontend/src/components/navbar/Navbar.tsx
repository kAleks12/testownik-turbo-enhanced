import { Atom, Menu } from "lucide-react";
import { Link, matchPath, useLocation } from "react-router-dom";
import UserMenu from "./menu/UserMenu";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

const Navbar = () => {
  const location = useLocation();
  const routes = ["/home", "/search", "/add-new"];
  const baseRoute = routes.find((r) => matchPath(location.pathname, r));

  const getTextForeground = (page: string) => {
    if (baseRoute === page) {
      return "text-foreground";
    }

    return "text-muted-foreground";
  };
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link to="/home">
          <Atom />
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
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Atom />
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
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial"></div>
        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
