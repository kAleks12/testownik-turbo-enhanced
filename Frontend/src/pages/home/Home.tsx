import React, { useEffect, useState } from "react";

import { useAuth } from "@/shared/hooks/auth/useAuth";
import Navbar from "@/components/navbar/Navbar";
import TestCard from "../../components/test-card/TestCard";
import Client from "@/api/Client";
import { ITest } from "@/shared/interfaces";

const Home: React.FC = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<ITest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testsData = await Client.getActiveTests();
        console.log("Tests data:", testsData);

        setTests(testsData);
      } catch (error) {
        console.error("An error occurred while fetching tests:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleted = (id: string) => {
    setTests(tests.filter((test) => test.id !== id));
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-2 text-center py-4">
          <div className="text-4xl">
            Cześć, {user?.firstName} {user?.lastName}
          </div>
          <div className="flex flex-col md:flex-row mx-auto text-center text-balance text-muted-foreground">
            <p>Zacznij się uczyć&nbsp;</p>
            <p>(najlepiej tak z dzień przed kolosem)</p>
          </div>
        </div>
        <div className="text-xl md:text-2xl">
          Dostępne testowniki na ten semestr:
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} onDeleted={handleDeleted} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
