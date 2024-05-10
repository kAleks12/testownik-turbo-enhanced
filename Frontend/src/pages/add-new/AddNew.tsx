import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui";
import React from "react";
import AddManual from "./add-manual/AddManual";
import { ICourse } from "@/shared/interfaces";
import Client from "@/api/Client";

const AddNew: React.FC = () => {
  const [courses, setCourses] = React.useState<ICourse[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await Client.getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("An error occurred while fetching courses:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[550px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-6xl font-bold">DODAJ NOWE PYTANIA</h1>
            <p className="text-balance text-muted-foreground">
              Pozwól sobie i innym przetestować swoje umiejętności
            </p>
          </div>
          <div className="grid gap-4 mt-4">
            <Button>Dodaj z plików</Button>
            {/* <Button>Dodaj ze zdjęć (OCR)</Button> */}
            <AddManual courses={courses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNew;
