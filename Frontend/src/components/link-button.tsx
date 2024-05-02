import { useAuth } from "@/shared/hooks/auth/useAuth";
import { Button } from "./ui/button";

const LinkButton = () => {
  const { login } = useAuth();
  const handleClick = () => {
    login();
  };

  return <Button onClick={handleClick}>Zaloguj poprzez USOS</Button>;
};

export default LinkButton;
