import { Button } from "@/components/ui/button";
import Routes from "@/shared/utils/routes";
import { useNavigate } from "react-router-dom";

const StartingPage = () => {
  const navigate = useNavigate();

  const onLogin = () => {
    navigate(Routes.Login);
  }
  const onRegister = () => {
    navigate(Routes.Register);
  }

  return (
    <main className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center h-screen">
        <div className="mx-auto grid w-[350px] gap-6 px-2 pb-24 lg:pb-0">
          <div className="grid gap-2 text-center">
            <h1 className="text-5xl md:text-6xl font-bold">TESTOWNIK TURBO</h1>
            <p className="text-balance text-muted-foreground">
              Wznieś swoją naukę na wyżyny i osiągaj sukces!
            </p>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 mt-4">
            <Button className="flex-grow" onClick={onLogin}>
              Zaloguj się
            </Button>
            <Button variant="secondary" className="flex-grow" onClick={onRegister}>
              Zarejestruj się
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="\pexels-elijahsad-7711126.jpg"
          alt="Image"
          className="h-full w-full object-cover dark:grayscale"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
    </main>
  );
};

export default StartingPage;
