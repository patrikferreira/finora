"use client";
import { useContext, useState, useMemo, useEffect } from "react";
import AppContext from "../AppContext";
import LoadingSpin from "../components/LoadingSpin";
import { IoInformationCircleOutline } from "react-icons/io5";
import { HiMiniEllipsisVertical } from "react-icons/hi2";
import Controls from "../components/Controls";
import SortIcon from "../components/SortIcon";
import Popover from "../components/Popover";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteExpense } from "../AppServices";
import { useTranslation } from "react-i18next";

type SortField = "description" | "amount" | "category" | "cycle";
type SortOrder = "asc" | "desc" | null;

const PAGE_SIZE = 10;

export default function Expenses() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const {
    user,
    initialFetching,
    localExpenses,
    searchQuery,
    currentPage,
    setCurrentPage,
    setExpenseDetail,
    setConfirmAction,
    setToast,
    setRefreshData,
  } = context;

  function handleMenu(id?: string) {
    setMenuOpen((prev) => (prev === id ? null : id ?? null));
  }

  const [sortField, setSortField] = useState<SortField | null>("description");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

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
  };

  function formatAmount(amount: number | null | undefined) {
    const value = amount ?? 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: user?.currency || "USD",
      minimumFractionDigits: 0,
    }).format(value);
  }

  async function handleDelete(id: string) {
    const res = await deleteExpense(id);

    if (res.error) {
      setToast({
        message: res.error || "Failed to delete expense",
        status: "error",
        show: true,
      });
      return;
    }

    setToast({
      message: "Expense deleted successfully",
      status: "success",
      show: true,
    });

    setRefreshData(true);
  }

  async function handleDeleteClick(id: string) {
    setConfirmAction({
      show: true,
      title: "Delete Expense",
      message:
        "Are you sure you want to delete this expense? This action cannot be undone.",
      onConfirm: () => handleDelete(id),
    });

    setMenuOpen(null);
  }

  function handleRowDoubleClick(expense: (typeof localExpenses)[0]) {
    setExpenseDetail({
      show: true,
      newExpense: false,
      currentExpense: expense,
    });
  }

  const sortedExpenses = useMemo(() => {
    let filtered = localExpenses;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (expense) =>
          expense.description?.toLowerCase().includes(query) ||
          expense.category?.toLowerCase().includes(query) ||
          expense.cycle?.toLowerCase().includes(query) ||
          expense.amount?.toString().includes(query)
      );
    }

    const activeSortField = sortField || "description";
    const activeSortOrder = sortOrder || "asc";

    return [...filtered].sort((a, b) => {
      let aValue = a[activeSortField];
      let bValue = b[activeSortField];

      if (aValue == null) aValue = activeSortField === "amount" ? 0 : "";
      if (bValue == null) bValue = activeSortField === "amount" ? 0 : "";

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return activeSortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return activeSortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [localExpenses, sortField, sortOrder, searchQuery]);

  const totalPages = Math.ceil(sortedExpenses.length / PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortOrder, setCurrentPage]);

  const visibleExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return sortedExpenses.slice(startIndex, endIndex);
  }, [sortedExpenses, currentPage]);

  if (initialFetching)
    return (
      <div className="flex justify-center items-center h-svh w-full">
        <LoadingSpin className="" />
      </div>
    );

  if (!user) return;

  return (
    <div
      className={`p-4 flex flex-col overflow-auto gap-4 w-full animate-fadeIn`}
    >
      {/* TITLE VIEW */}
      <div className="hidden md:flex flex-col">
        <h1 className="text-2xl font-semibold">{t("Expenses")}</h1>
        <span className="opacity-50 text-sm">
          {t("Track & manage your spending")}
        </span>
      </div>

      {/* CONTROLS */}
      <Controls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* TABLE */}
      <div className="w-full rounded-2xl border border-(--border) shadow hover:border-(--border) overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("description")}
                className={`w-1/5 text-left bg-(--bg-secondary) tracking-wider border-(--border) px-4 text-xs uppercase py-3 cursor-pointer transition-all ${
                  visibleExpenses.length === 0
                    ? "border-none"
                    : "border-b border-(--border)"
                }`}
              >
                <div className="flex items-center gap-2">
                  {t("description")}
                  <SortIcon
                    field="description"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("amount")}
                className={`w-1/5 text-left bg-(--bg-secondary) tracking-wider font-semibold border-(--border) px-4 text-xs uppercase py-3 cursor-pointer transition-all ${
                  visibleExpenses.length === 0
                    ? "border-none"
                    : "border-b border-(--border)"
                }`}
              >
                <div className="flex items-center gap-2">
                  {t("amount")}
                  <SortIcon
                    field="amount"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className={`w-1/5 text-left bg-(--bg-secondary) tracking-wider font-semibold border-(--border) px-4 text-xs uppercase hidden md:table-cell py-3 cursor-default transition-all ${
                  visibleExpenses.length === 0
                    ? "border-none"
                    : "border-b border-(--border)"
                }`}
              >
                <div className="flex items-center gap-2">{t("category")}</div>
              </th>
              <th
                className={`w-1/5 text-left bg-(--bg-secondary) tracking-wider font-semibold border-(--border) px-4 text-xs uppercase hidden md:table-cell py-3 cursor-default transition-all ${
                  visibleExpenses.length === 0
                    ? "border-none"
                    : "border-b border-(--border)"
                }`}
              >
                <div className="flex items-center gap-2">{t("cycle")}</div>
              </th>
              <th
                className={`w-1/10 text-left bg-(--bg-secondary) px-4 text-xs border-(--border) uppercase py-3 ${
                  visibleExpenses.length === 0
                    ? "border-none"
                    : "border-b border-(--border)"
                }`}
              ></th>
            </tr>
          </thead>

          <tbody>
            {visibleExpenses.map((expense) => (
              <tr
                key={expense.id}
                onDoubleClick={() => handleRowDoubleClick(expense)}
                className={`border-b border-(--border) last:border-0 bg-(--bg-secondary) group hover:bg-(--bg-tertiary)`}
              >
                <td className="w-1/5 px-4 py-3 text-sm truncate opacity-50 group-hover:opacity-100">
                  {expense.description.charAt(0).toUpperCase() +
                    expense.description.slice(1)}
                </td>
                <td className="w-1/5 px-4 py-3 text-sm opacity-50 group-hover:opacity-100">
                  {formatAmount(expense.amount)}
                </td>
                <td className="w-1/5 px-4 py-3 text-sm hidden md:table-cell opacity-50 group-hover:opacity-100">
                  {expense?.category ? t(`${expense.category}`) : ""}
                </td>
                <td className="w-1/5 px-4 py-3 text-sm hidden md:table-cell opacity-50 group-hover:opacity-100">
                  {expense?.cycle ? t(`${expense.cycle}`) : ""}
                </td>
                <td className="w-1/10 px-4 text-sm">
                  <button
                    onClick={() => handleMenu(expense.id)}
                    className="opacity-50 group-hover:opacity-100 cursor-pointer p-2 rounded-2xl border border-(--border) hover:border-(--border) transition duration-200 flex items-center justify-center"
                  >
                    <HiMiniEllipsisVertical />
                  </button>

                  {menuOpen === expense.id && (
                    <Popover
                      onClose={() => setMenuOpen(null)}
                      className="right-17 lg:right-29 !w-40"
                    >
                      <div className="flex flex-col p-1.5 text-sm">
                        <button
                          onClick={() => {
                            setExpenseDetail({
                              show: true,
                              newExpense: false,
                              currentExpense: expense,
                            });

                            setMenuOpen(null);
                          }}
                          className="p-2 w-full hover:bg-(--bg-tertiary) hover:text-(--foreground) transition duration-200 rounded-2xl text-left cursor-pointer flex gap-2 items-center"
                        >
                          <FaRegEdit /> {t("Edit")}
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteClick(expense.id!);
                          }}
                          className="p-2 w-full hover:bg-(--bg-tertiary) hover:text-(--foreground) transition duration-200 rounded-2xl text-left cursor-pointer flex gap-2 items-center"
                        >
                          <FaRegTrashCan /> {t("Delete")}
                        </button>
                      </div>
                    </Popover>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedExpenses.length > 0 ? (
        <div className="px-4 text-sm w-max cursor-default opacity-50 hover:opacity-100 transition duration-200 flex items-center gap-2">
          <IoInformationCircleOutline />
          <span>{`${t("Showing")} ${visibleExpenses.length} / ${
            sortedExpenses.length
          }`}</span>
        </div>
      ) : (
        <div className="px-4 text-sm w-max cursor-default opacity-50 hover:opacity-100 transition duration-200 flex items-center gap-2">
          <IoInformationCircleOutline />
          {searchQuery.trim()
            ? t("No expenses found matching your search")
            : t("You haven't added any expenses yet")}
        </div>
      )}
    </div>
  );
}
