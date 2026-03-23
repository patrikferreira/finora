import Link from "next/link";
import { Expense } from "../AppTypes";
import { useState, useMemo, useEffect, useRef, useContext } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import SortIcon from "./SortIcon";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";

type Props = {
  className?: string;
  expenses?: Expense[];
};

type SortField = "description" | "amount";
type SortOrder = "asc" | "desc" | null;

export default function ExpenseViewTable({ expenses = [], className }: Props) {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, billingCycle } = context;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField | null>("description");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const contentRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  function formatAmount(amount: number | null | undefined) {
    const value = amount ?? 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: user?.currency || "USD",
      minimumFractionDigits: 0,
    }).format(value);
  }

  const filteredExpenses = useMemo(() => {
    return billingCycle === "totaly"
      ? expenses
      : expenses.filter((expense) => expense.cycle === billingCycle);
  }, [expenses, billingCycle]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, expense) => sum + (expense.amount ?? 0),
      0
    );
  }, [filteredExpenses]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc"
      );
      if (sortOrder === "desc") setSortField(null);
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const sortedExpenses = useMemo(() => {
    if (!sortField || !sortOrder) return filteredExpenses;

    return [...filteredExpenses].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue == null) aValue = sortField === "amount" ? 0 : "";
      if (bValue == null) bValue = sortField === "amount" ? 0 : "";

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredExpenses, sortField, sortOrder]);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (
        !contentRef.current ||
        !tableRef.current ||
        sortedExpenses.length === 0
      ) {
        return;
      }

      const contentHeight = contentRef.current.clientHeight;
      const headerHeight =
        tableRef.current.querySelector("thead")?.clientHeight || 0;
      const firstRow = tableRef.current.querySelector("tbody tr");

      if (!firstRow) return;

      const rowHeight = firstRow.clientHeight;
      const availableHeight = contentHeight - headerHeight;

      const calculatedItems = Math.max(
        1,
        Math.floor(availableHeight / rowHeight)
      );

      setItemsPerPage(calculatedItems);
      setCurrentPage(1);
    };

    calculateItemsPerPage();

    const resizeObserver = new ResizeObserver(calculateItemsPerPage);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [sortedExpenses.length]);

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  const visibleExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedExpenses.slice(startIndex, endIndex);
  }, [sortedExpenses, currentPage, itemsPerPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div
      className={`flex flex-col justify-between border border-(--border) bg-(--bg-secondary) shadow hover:shadow-xl transition-all duration-200 rounded-2xl ${className}`}
    >
      <div className="flex flex-col gap-4 p-4 flex-1 min-h-0">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h2 className="text-md lg:text-lg">{t("Expense list")}</h2>
            <p className="text-sm opacity-50">
              {t("Analyze the percentage metric by expense")}
            </p>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-2xl border border-(--border) hover:border-(--border) disabled:opacity-30 disabled:cursor-not-allowed transition duration-200"
              >
                <IoChevronBack />
              </button>
              <span className="text-sm opacity-50">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-2xl border border-(--border) hover:border-(--border) disabled:opacity-30 disabled:cursor-not-allowed transition duration-200"
              >
                <IoChevronForward />
              </button>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div ref={contentRef} className="flex-1 flex flex-col min-h-80">
          {filteredExpenses.length === 0 ? (
            <div className="flex items-center justify-center flex-1 text-sm opacity-50">
              {t("No expenses yet")}
            </div>
          ) : (
            <div className="max-h-full flex flex-col overflow-hidden rounded-2xl border border-(--border)">
              <table ref={tableRef} className="w-full table-fixed">
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSort("description")}
                      className="w-2/5 text-left bg-(--bg-secondary) tracking-wider border-b border-(--border) px-4 text-xs uppercase py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {t("Description")}
                        <SortIcon
                          field="description"
                          sortField={sortField}
                          sortOrder={sortOrder}
                        />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("amount")}
                      className="w-1/5 text-left bg-(--bg-secondary) tracking-wider border-b border-(--border) px-4 text-xs uppercase py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {t("Amount")}
                        <SortIcon
                          field="amount"
                          sortField={sortField}
                          sortOrder={sortOrder}
                        />
                      </div>
                    </th>
                    <th className="w-1/5 text-left bg-(--bg-secondary) tracking-wider border-b border-(--border) px-4 text-xs uppercase py-3 hidden md:table-cell">
                      {t("Category")}
                    </th>
                    <th className="w-1/5 text-left bg-(--bg-secondary) tracking-wider border-b border-(--border) px-4 text-xs uppercase py-3 table-cell">
                      %
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleExpenses.map((expense) => {
                    const percentage =
                      totalAmount > 0
                        ? (((expense.amount ?? 0) / totalAmount) * 100).toFixed(
                            1
                          )
                        : "0.0";

                    return (
                      <tr
                        key={expense.id}
                        className="border-b border-(--border) last:border-0 bg-(--bg-secondary) hover:bg-(--bg-tertiary)"
                      >
                        <td className="w-2/5 px-4 py-3 text-sm truncate opacity-50">
                          {expense.description.charAt(0).toUpperCase() +
                            expense.description.slice(1)}
                        </td>
                        <td className="w-1/5 px-4 py-3 text-sm opacity-50">
                          {formatAmount(expense.amount)}
                        </td>
                        <td className="w-1/5 px-4 py-3 text-sm hidden md:table-cell opacity-50">
                          {expense?.category
                            ? expense.category.charAt(0).toUpperCase() +
                              expense.category.slice(1)
                            : "-"}
                        </td>
                        <td className="w-1/5 px-4 py-3 text-sm table-cell opacity-50">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {filteredExpenses.length > 0 && (
        <div className="w-full flex items-center justify-center p-4 border-t border-(--border)">
          <Link
            href="/expenses"
            className="text-sm opacity-50 hover:opacity-100 transition duration-200"
          >
            {t("View expenses list")}
          </Link>
        </div>
      )}
    </div>
  );
}
