import React, { useEffect, useState } from "react";

import { useAuth } from "@/shared/hooks/auth/useAuth";
import Navbar from "@/components/navbar/Navbar";
import TestCard from "../../components/test-card/TestCard";
import Client from "@/api/Client";
import { ITest } from "@/shared/interfaces";
import Loader from "@/components/loader/Loader";

const Home: React.FC = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<ITest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const testsData = await Client.Tests.getActiveTests();
        console.log("Tests data:", testsData);

        setTests(testsData);
      } catch (error) {
        console.error("An error occurred while fetching tests:", error);
      } finally {
        setIsLoading(false);
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
        <div className="text-xl lg:text-2xl">
          Dostępne testowniki na ten semestr:
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} onDeleted={handleDeleted} />
          ))}
        </div>
      </main>
      <Loader isLoading={isLoading} />
    </div>
  );
};

export default Home;
