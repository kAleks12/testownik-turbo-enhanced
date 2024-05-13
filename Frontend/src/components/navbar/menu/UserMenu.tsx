import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { CircleUser } from "lucide-react";
import { Button } from "../../ui/button";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import ThemeButton from "./theme-button/ThemeButton";

const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-center">
          {user?.firstName} {user?.lastName}
        </DropdownMenuLabel>
        <Separator />
        <DropdownMenuItem>
          <div className="mx-auto group">
            <ThemeButton />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <Button variant="link" className="mx-auto">
            Wyloguj się
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
