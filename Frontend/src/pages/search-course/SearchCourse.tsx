import Navbar from "@/components/navbar/Navbar";
import { Input } from "@/components/ui/input";
import { NavbarPages } from "@/shared/enums/NavbarPages";

const SearchCourse: React.FC = () => {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Navbar page={NavbarPages.Home} />
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
            </main>
        </div>
    );
}

export default SearchCourse;