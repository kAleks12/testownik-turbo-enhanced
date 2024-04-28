import { Button } from "./ui/button";

const AUTH_LINK = import.meta.env.VITE_AUTH_LINK;

const LinkButton = () => {
  const handleClick = () => {
    window.open(AUTH_LINK, "_self");
  };

  return <Button onClick={handleClick}>Zaloguj poprzez USOS</Button>;
};

export default LinkButton;
