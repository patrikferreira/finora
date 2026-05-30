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
import { deleteIncome } from "../AppServices";
import { useTranslation } from "react-i18next";

type SortField = "description" | "amount" | "category" | "cycle";
type SortOrder = "asc" | "desc" | null;

const PAGE_SIZE = 10;

export default function Incomes() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const {
    user,
    initialFetching,
    localIncomes,
    searchQuery,
    currentPage,
    setCurrentPage,
    setIncomeDetail,
    setConfirmAction,
    setToast,
    setRefreshData,
  } = context;

  function handleMenu(id?: string) {
    setMenuOpen((prev) => (prev === id ? null : (id ?? null)));
  }

  const [sortField, setSortField] = useState<SortField | null>("description");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc",
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
    const res = await deleteIncome(id);

    if (res.error) {
      setToast({
        message: res.error || "Failed to delete income",
        status: "error",
        show: true,
      });
      return;
    }

    setToast({
      message: "Income deleted successfully",
      status: "success",
      show: true,
    });

    setRefreshData(true);
  }

  async function handleDeleteClick(id: string) {
    setConfirmAction({
      show: true,
      title: "Delete Income",
      message:
        "Are you sure you want to delete this income? this action cannot be undone.",
      onConfirm: () => handleDelete(id),
    });

    setMenuOpen(null);
  }

  function handleRowDoubleClick(income: (typeof localIncomes)[0]) {
    setIncomeDetail({
      show: true,
      newIncome: false,
      currentIncome: income,
    });
  }

  const sortedIncomes = useMemo(() => {
    let filtered = localIncomes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (income) =>
          income.description?.toLowerCase().includes(query) ||
          income.category?.toLowerCase().includes(query) ||
          income.cycle?.toLowerCase().includes(query) ||
          income.amount?.toString().includes(query),
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
  }, [localIncomes, sortField, sortOrder, searchQuery]);

  const totalPages = Math.ceil(sortedIncomes.length / PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortOrder, setCurrentPage]);

  const visibleIncomes = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return sortedIncomes.slice(startIndex, endIndex);
  }, [sortedIncomes, currentPage]);

  if (initialFetching)
    return (
      <div className="flex justify-center items-center h-svh w-full">
        <LoadingSpin className="" />
      </div>
    );

  if (!user) return;

  return (
    <div
      className={`p-4 lg:p-6 flex flex-col overflow-auto gap-5 w-full animate-fadeIn`}
    >
      {/* TITLE VIEW */}
      <div className="hidden md:flex flex-col">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("Incomes")}
        </h1>
        <span className="text-(--muted) text-sm">
          {t("Track & manage your earnings")}
        </span>
      </div>

      {/* CONTROLS */}
      <Controls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* TABLE */}
      <div className="w-full rounded-2xl border border-(--border) bg-(--bg-secondary) overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-(--bg-primary)/40">
              <th
                onClick={() => handleSort("description")}
                className={`w-1/5 text-left tracking-wider px-4 text-[11px] text-(--muted) font-medium uppercase py-3.5 cursor-pointer hover:text-(--foreground) transition-colors ${
                  visibleIncomes.length === 0
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
                className={`w-1/5 text-left tracking-wider px-4 text-[11px] text-(--muted) font-medium uppercase py-3.5 cursor-pointer hover:text-(--foreground) transition-colors ${
                  visibleIncomes.length === 0
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
                className={`w-1/5 text-left tracking-wider px-4 text-[11px] text-(--muted) font-medium uppercase hidden md:table-cell py-3.5 ${
                  visibleIncomes.length === 0
                    ? "border-none"
                    : "border-b border-(--border)"
                }`}
              >
                <div className="flex items-center gap-2">{t("category")}</div>
              </th>
              <th
                className={`w-1/5 text-left tracking-wider px-4 text-[11px] text-(--muted) font-medium uppercase hidden md:table-cell py-3.5 ${
                  visibleIncomes.length === 0
                    ? "border-none"
                    : "border-b border-(--border)"
                }`}
              >
                <div className="flex items-center gap-2">{t("cycle")}</div>
              </th>
              <th
                className={`w-1/10 text-left px-4 text-[11px] uppercase py-3.5 ${
                  visibleIncomes.length === 0
                    ? "border-none"
                    : "border-b border-(--border)"
                }`}
              ></th>
            </tr>
          </thead>

          <tbody>
            {visibleIncomes.map((income) => (
              <tr
                key={income.id}
                onDoubleClick={() => handleRowDoubleClick(income)}
                className={`border-b border-(--border) last:border-0 group hover:bg-(--bg-tertiary)/50 transition-colors`}
              >
                <td className="w-1/5 px-4 py-3.5 text-sm truncate font-medium">
                  {income.description.charAt(0).toUpperCase() +
                    income.description.slice(1)}
                </td>
                <td className="w-1/5 px-4 py-3.5 text-sm tabular text-(--primary) font-medium">
                  {formatAmount(income.amount)}
                </td>
                <td className="w-1/5 px-4 py-3.5 text-sm hidden md:table-cell">
                  {income?.category ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-(--bg-tertiary) text-(--muted) border border-(--border)">
                      {t(`${income.category}`)}
                    </span>
                  ) : (
                    ""
                  )}
                </td>
                <td className="w-1/5 px-4 py-3.5 text-sm hidden md:table-cell text-(--muted)">
                  {income?.cycle ? t(`${income.cycle}`) : ""}
                </td>
                <td className="w-1/10 px-4 text-sm">
                  <button
                    onClick={() => handleMenu(income.id)}
                    className="opacity-0 group-hover:opacity-100 cursor-pointer p-1.5 rounded-lg text-(--muted) hover:text-(--foreground) hover:bg-(--bg-tertiary) transition-all duration-150 flex items-center justify-center"
                  >
                    <HiMiniEllipsisVertical size={18} />
                  </button>

                  {menuOpen === income.id && (
                    <Popover
                      onClose={() => setMenuOpen(null)}
                      className="right-17 lg:right-29 !w-40"
                    >
                      <div className="flex flex-col p-1.5 text-sm">
                        <button
                          onClick={() => {
                            setIncomeDetail({
                              show: true,
                              newIncome: false,
                              currentIncome: income,
                            });

                            setMenuOpen(null);
                          }}
                          className="p-2 w-full text-(--muted) hover:bg-(--bg-tertiary) hover:text-(--foreground) transition duration-150 rounded-lg text-left cursor-pointer flex gap-2 items-center"
                        >
                          <FaRegEdit /> {t("Edit")}
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteClick(income.id!);
                          }}
                          className="p-2 w-full text-(--muted) hover:bg-(--danger-soft) hover:text-(--danger) transition duration-150 rounded-lg text-left cursor-pointer flex gap-2 items-center"
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
      {sortedIncomes.length > 0 ? (
        <div className="px-1 text-xs text-(--muted) flex items-center gap-2">
          <IoInformationCircleOutline size={14} />
          <span>{`${t("Showing")} ${visibleIncomes.length} / ${sortedIncomes.length}`}</span>
        </div>
      ) : (
        <div className="px-1 text-xs text-(--muted) flex items-center gap-2">
          <IoInformationCircleOutline size={14} />
          {searchQuery.trim()
            ? t("No incomes found matching your search")
            : t("You haven't added any incomes yet")}
        </div>
      )}
    </div>
  );
}
