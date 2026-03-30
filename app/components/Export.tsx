import { useContext, useState } from "react";
import { CiExport } from "react-icons/ci";
import AppContext from "../AppContext";
import Spin from "./Spin";
import { exportToExcel } from "../utils/exportExcel";
import { useTranslation } from "react-i18next";

type Props = {
  view: string;
};

export default function Export({ view }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { localIncomes, localExpenses } = context;

  function exportData() {
    setIsLoading(true);

    try {
      const isExpenseView = view === "expenses";
      const data = isExpenseView ? localExpenses : localIncomes;
      const viewName = isExpenseView ? t("expenses") : t("incomes");

      const translatedData = data.map((item) => ({
        ...item,
        category: item.category
          ? t(item.category, { defaultValue: item.category })
          : "",
        cycle: item.cycle ? t(item.cycle, { defaultValue: item.cycle }) : "",
      }));

      const columns = [
        { key: "description", label: t("description") },
        { key: "amount", label: t("amount") },
        { key: "category", label: t("category") },
        { key: "cycle", label: t("cycle") },
      ];

      exportToExcel<Record<string, unknown>>({
        data: translatedData,
        columns,
        filename: `${viewName}-${new Date().toISOString().split("T")[0]}.xlsx`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }

  const currentData = view === "expenses" ? localExpenses : localIncomes;

  return (
    <button
      className={`h-10 min-w-10 flex items-center justify-center rounded-full border border-(--border) group text-sm bg-(--bg-secondary) group transition duration-200 ${
        isLoading ? "cursor-default" : "cursor-pointer"
      }`}
      onClick={exportData}
      aria-label={`Export local ${view} to Excel`}
      disabled={!currentData || isLoading}
    >
      {isLoading ? (
        <Spin className="border-white/70 border-t-(--primary)" />
      ) : (
        <CiExport
          className="opacity-50 group-hover:opacity-100 transition-all duration-200"
          size={18}
        />
      )}
    </button>
  );
}
