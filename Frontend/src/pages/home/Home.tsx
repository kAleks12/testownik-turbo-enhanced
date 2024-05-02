import React from "react";
import { Link } from "react-router-dom";
import { Atom, CircleUser, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/shared/hooks/auth/useAuth";

const Home: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Atom />
          <Link
            to="#"
            className="text-foreground transition-colors hover:text-foreground whitespace-nowrap"
          >
            Strona główna
          </Link>
          <Link
            to="#"
            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
          >
            Rozpocznij naukę
          </Link>
          <Link
            to="#"
            className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
          >
            Dodaj testownik
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Atom />
              <Link
                to="#"
                className="text-foreground transition-colors hover:text-foreground whitespace-nowrap"
              >
                Strona główna
              </Link>
              <Link
                to="#"
                className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
              >
                Rozpocznij naukę
              </Link>
              <Link
                to="#"
                className="text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
              >
                Dodaj test
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.firstName} {user?.lastName}
              </DropdownMenuLabel>
              <Separator />
              <DropdownMenuItem onClick={handleLogout}>
                <Button variant="link">Wyloguj się</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-6xl">Tutaj coś będzie w przyszłości</div>
      </main>
    </div>
  );
};

export default Home;
