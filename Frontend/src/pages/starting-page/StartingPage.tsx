import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { Info } from "lucide-react";

const StartingPage = () => {
  const { login } = useAuth();
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
          <div className="flex flex-row items-center justify-center gap-4 mt-4">
            <Button className="flex-grow" onClick={login}>
              Zaloguj poprzez USOS
            </Button>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Info />
              </HoverCardTrigger>
              <HoverCardContent>
                <p className="text-center">
                  Dane pobierane z systemu USOS wykorzystywane są w celu
                  uzyskania aktualnych kursów użytkownika. Dane nie są
                  gromadzone.
                </p>
              </HoverCardContent>
            </HoverCard>
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
