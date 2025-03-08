import React from "react";

import { useAuth } from "@/shared/hooks/auth/useAuth";
import Navbar from "@/components/navbar/Navbar";

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-8 lg:p-8">
        <div className="grid gap-2 text-center py-4">
          <div className="text-4xl">
            Cześć, {user?.firstName} {user?.lastName}
          </div>
          <div className="flex flex-col lg:flex-row mx-auto text-center text-balance text-muted-foreground">
            <p>Zacznij się uczyć&nbsp;</p>
            <p>(najlepiej tak z dzień przed kolosem)</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
