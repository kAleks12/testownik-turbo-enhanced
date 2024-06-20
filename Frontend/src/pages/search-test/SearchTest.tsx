import Client from "@/api/Client";
import Loader from "@/components/loader/Loader";
import Navbar from "@/components/navbar/Navbar";
import TestCard from "@/components/test-card/TestCard";
import { Label } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { ITest } from "@/shared/interfaces";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SearchCourse: React.FC = () => {
  const [tests, setTests] = useState<ITest[]>([]);
  const [searchParams] = useSearchParams();
  const [filteredTests, setFilteredTests] = useState<ITest[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [teacherFilter, setTeacherFilter] = useState<string>("");
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleted = (id: string) => {
    setTests(tests.filter((test) => test.id !== id));
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const testsData = await Client.Tests.getTests();
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

  useEffect(() => {
    const courseParam = searchParams.get("course");
    if (courseParam) {
      setCourseFilter(courseParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const splitTeacher = teacherFilter.split(" ");
    let tests1 = tests;
    if (splitTeacher.length > 0) {
      tests1 = tests1.filter(
        (t) =>
          t.course?.teacher?.name
            .toLowerCase()
            .includes(splitTeacher[0].toLowerCase()) ||
          t.course?.teacher?.surname
            .toLowerCase()
            .includes(splitTeacher[0].toLowerCase())
      );
    }
    if (splitTeacher.length > 1) {
      tests1 = tests1.filter(
        (t) =>
          t.course?.teacher?.name
            .toLowerCase()
            .includes(splitTeacher[1].toLowerCase()) ||
          t.course?.teacher?.surname
            .toLowerCase()
            .includes(splitTeacher[1].toLowerCase())
      );
    }
    if (nameFilter) {
      tests1 = tests1.filter((t) =>
        t.name?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (courseFilter) {
      tests1 = tests1.filter(
        (t) =>
          t.course?.name?.toLowerCase().includes(courseFilter.toLowerCase()) ||
          t.course?.name
            ?.split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toLowerCase()
            .includes(courseFilter.toLowerCase())
      );
    }
    setFilteredTests(tests1);
  }, [courseFilter, nameFilter, teacherFilter, tests]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-8 lg:p-8">
        <div className="grid gap-2 text-center">
          <div className="text-4xl font-bold">
            WYSZUKAJ SWÓJ ZBAWCZY TESTOWNIK
          </div>
          <p className="text-balance text-muted-foreground">
            I skończ wreszcie udawać że się uczysz
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="grow">
            <Label>Nazwa testo</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                type="search"
                placeholder="Wyszukaj..."
                className="pl-8"
              />
            </div>
          </div>
          <div className="grow">
            <Label>Prowadzący</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                type="search"
                placeholder="Wyszukaj..."
                className="pl-8"
              />
            </div>
          </div>
          <div className="grow">
            <Label>Nazwa przedmiotu</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                type="search"
                placeholder="Wyszukaj..."
                className="pl-8"
              />
            </div>
          </div>
        </div>
        <div className="text-2xl">Testowniki:</div>
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} onDeleted={handleDeleted} />
          ))}
        </div>
      </main>
      <Loader isLoading={isLoading} />
    </div>
  );
};

export default SearchCourse;
