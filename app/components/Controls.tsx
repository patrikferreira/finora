import { IoAddOutline } from "react-icons/io5";
import RefreshData from "./RefreshData";
import { usePathname } from "next/navigation";
import Search from "./Search";
import Pagination from "./Pagination";

interface ControlsProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function Controls({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}: ControlsProps) {
  const pathname = usePathname();
  const view = pathname?.replace(/^\//, "") ?? "";

  return (
    <div className="flex items-center justify-between w-full gap-2 ">
      <Search />
      <div className="flex items-center gap-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
        <RefreshData view={view} />
        <button className="px-3 h-10 text-sm bg-(--primary-color) text-(--background) cursor-pointer flex items-center gap-2 justify-center shadow-lg transition duration-200 hover:brightness-115 rounded-full">
          <IoAddOutline />
          <span className="hidden md:flex">Add</span>
        </button>
      </div>
    </div>
  );
}
