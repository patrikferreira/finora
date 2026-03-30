import { IoAddOutline } from "react-icons/io5";
import RefreshData from "./RefreshData";
import { usePathname } from "next/navigation";
import Search from "./Search";
import Pagination from "./Pagination";
import { useContext } from "react";
import AppContext from "../AppContext";
import Export from "./Export";
import { useTranslation } from "react-i18next";
import Button from "./Button";

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
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { setIncomeDetail, incomeDetail, setExpenseDetail, expenseDetail } =
    context;

  const pathname = usePathname();
  const view = pathname?.replace(/^\//, "") ?? "";

  const handleAdd = () => {
    if (view === "expenses") {
      setExpenseDetail({
        ...expenseDetail,
        currentExpense: null,
        newExpense: true,
        show: true,
      });
    } else {
      setIncomeDetail({
        ...incomeDetail,
        currentIncome: null,
        newIncome: true,
        show: true,
      });
    }
  };

  return (
    <div className="flex items-center justify-between w-full gap-2 ">
      <Search />
      <div className="flex items-center gap-2">
        <Export view={view} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
        <RefreshData view={view} />
        <Button
          action={handleAdd}
          text="Add"
          icon={<IoAddOutline />}
          hiddenTextOnMobile={true}
          className="bg-(--primary) !min-w-0 h-10 rounded-full"
        />
      </div>
    </div>
  );
}
