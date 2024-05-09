import Client from "@/api/Client";
import Navbar from "@/components/navbar/Navbar";
import TestCard from "@/components/test-card/TestCard";
import { Input } from "@/components/ui/input";
import { NavbarPages } from "@/shared/enums/NavbarPages";
import { ITest } from "@/shared/interfaces";
import { useState, useEffect } from "react";

const SearchCourse: React.FC = () => {
  const [tests, setTests] = useState<ITest[]>([]);

  const handleDeleted = (id: string) => {
    setTests(tests.filter((test) => test.id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testsData = await Client.getTests();
        console.log("Tests data:", testsData);

        setTests(testsData);
      } catch (error) {
        console.error("An error occurred while fetching tests:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar page={NavbarPages.SearchCourse} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        Wyszukaj swój boży kurs
        <form>
          <div>
            <Input
              type="search"
              placeholder="Search ..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <div className="text-2xl">Testowniki:</div>
        <div className="grid gap-4 md:grid-cols-2">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} onDeleted={handleDeleted} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SearchCourse;
