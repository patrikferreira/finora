"use client";
import { useContext, useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import AppContext from "../AppContext";
import LoadingSpin from "../components/LoadingSpin";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { LuSearchX, LuWallet } from "react-icons/lu";
import Search from "../components/Search";
import Export from "../components/Export";
import RefreshData from "../components/RefreshData";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import SortIcon from "../components/SortIcon";
import { deleteIncome } from "../AppServices";
import { Income } from "../AppTypes";
import { useTranslation } from "react-i18next";

type SortField = "description" | "amount" | "category" | "cycle";
type SortOrder = "asc" | "desc" | null;

const PAGE_SIZE = 10;

const thClass =
  "sticky top-0 z-10 bg-(--bg-muted) shadow-[inset_0_-1px_0_var(--border)] px-3 md:px-4 py-2.5 text-xs font-semibold text-(--muted)";

type SortHeaderProps = {
  field: SortField;
  label: string;
  sortField: SortField | null;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  className?: string;
};

function SortHeader({
  field,
  label,
  sortField,
  sortOrder,
  onSort,
  className,
}: SortHeaderProps) {
  const active = sortField === field && sortOrder !== null;

  return (
    <th
      scope="col"
      aria-sort={
        active ? (sortOrder === "asc" ? "ascending" : "descending") : "none"
      }
      className={`${thClass} ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`inline-flex items-center gap-1.5 cursor-pointer hover:text-(--foreground) transition-colors ${
          active ? "text-(--foreground)" : ""
        }`}
      >
        {label}
        <SortIcon field={field} sortField={sortField} sortOrder={sortOrder} />
      </button>
    </th>
  );
}

export default function Incomes() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const {
    user,
    initialFetching,
    localIncomes,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    setIncomeDetail,
    setConfirmAction,
    setToast,
    setRefreshData,
  } = context;

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

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

  function formatDescription(description: string) {
    return description.charAt(0).toUpperCase() + description.slice(1);
  }

  function handleAdd() {
    setIncomeDetail({
      show: true,
      newIncome: true,
      currentIncome: null,
    });
  }

  function handleEdit(income: Income) {
    setIncomeDetail({
      show: true,
      newIncome: false,
      currentIncome: income,
    });
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

  function handleDeleteClick(id: string) {
    setConfirmAction({
      show: true,
      title: "Delete Income",
      message:
        "Are you sure you want to delete this income? This action cannot be undone.",
      onConfirm: () => handleDelete(id),
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

    if (!sortField || !sortOrder) return filtered;

    return [...filtered].sort((a, b) => {
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
  }, [localIncomes, sortField, sortOrder, searchQuery]);

  const totalCount = sortedIncomes.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [pathname, searchQuery, sortField, sortOrder, setCurrentPage]);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage, setCurrentPage]);

  const visibleIncomes = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return sortedIncomes.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedIncomes, safePage]);

  if (initialFetching)
    return (
      <div className="flex justify-center items-center h-svh w-full">
        <LoadingSpin className="" />
      </div>
    );

  if (!user) return;

  const isSearching = searchQuery.trim().length > 0;
  const rangeStart = totalCount === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, totalCount);

  return (
    <div className="min-h-svh lg:h-screen min-w-0 w-full p-4 md:p-6 flex flex-col gap-5 overflow-auto animate-fadeIn">
      {/* HEADER */}
      <header className="flex items-center justify-between gap-4 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {t("Incomes")}
            </h1>
            {localIncomes.length > 0 && (
              <span className="inline-flex items-center h-5 px-2 rounded-full border border-(--border) bg-(--bg-secondary)/90 text-xs font-semibold text-(--muted) tabular-nums shadow-sm">
                {localIncomes.length}
              </span>
            )}
          </div>
          <p className="text-sm text-(--muted)">
            {t("Track & manage your earnings")}
          </p>
        </div>
        <Button
          action={handleAdd}
          text="Add"
          icon={<FiPlus size={16} />}
          className="shrink-0"
        />
      </header>

      {/* LIST */}
      <section className="surface flex flex-col min-h-0 overflow-hidden">
        {/* TOOLBAR */}
        <div className="flex items-center justify-between gap-3 px-3 md:px-4 py-3 border-b border-(--border) shrink-0">
          <Search />
          <div className="flex items-center gap-2">
            <Export view="incomes" />
            <RefreshData view="incomes" />
          </div>
        </div>

        {totalCount > 0 ? (
          <>
            {/* TABLE */}
            <div className="min-h-0 overflow-auto">
              <table className="w-full table-fixed text-sm">
                <thead>
                  <tr>
                    <SortHeader
                      field="description"
                      label={t("description")}
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      className="text-left"
                    />
                    <SortHeader
                      field="category"
                      label={t("category")}
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      className="w-44 text-left hidden md:table-cell"
                    />
                    <SortHeader
                      field="cycle"
                      label={t("cycle")}
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      className="w-32 text-left hidden md:table-cell"
                    />
                    <SortHeader
                      field="amount"
                      label={t("amount")}
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      className="w-28 md:w-40 text-right"
                    />
                    <th scope="col" className={`${thClass} w-20 md:w-24`}>
                      <span className="sr-only">{t("Actions")}</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleIncomes.map((income) => {
                    const details = [income.category, income.cycle]
                      .filter((value): value is NonNullable<typeof value> =>
                        Boolean(value),
                      )
                      .map((value) => t(value))
                      .join(" · ");

                    return (
                      <tr
                        key={income.id}
                        onDoubleClick={() => handleEdit(income)}
                        className="border-b border-(--border) last:border-0 hover:bg-(--bg-muted) transition-colors"
                      >
                        <td className="px-3 md:px-4 py-3">
                          <p className="font-medium truncate">
                            {formatDescription(income.description)}
                          </p>
                          {details && (
                            <p className="md:hidden text-xs text-(--muted) truncate mt-0.5">
                              {details}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {income.category && (
                            <span className="inline-flex items-center h-6 px-2 rounded-lg border border-(--border) bg-(--bg-muted) text-xs font-medium text-(--muted)">
                              {t(income.category)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-(--muted)">
                          {income.cycle ? t(income.cycle) : ""}
                        </td>
                        <td className="px-3 md:px-4 py-3 text-right font-medium tabular-nums whitespace-nowrap">
                          {formatAmount(income.amount)}
                        </td>
                        <td
                          className="pr-2 md:pr-3 py-2"
                          onDoubleClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleEdit(income)}
                              title={t("Edit")}
                              aria-label={`${t("Edit")}: ${income.description}`}
                              className="h-8 w-8 rounded-md flex items-center justify-center text-(--muted) hover:text-(--foreground) hover:bg-(--border)/60 transition-colors cursor-pointer"
                            >
                              <FiEdit2 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(income.id!)}
                              title={t("Delete")}
                              aria-label={`${t("Delete")}: ${income.description}`}
                              className="h-8 w-8 rounded-md flex items-center justify-center text-(--muted) hover:text-(--danger) hover:bg-(--danger)/10 transition-colors cursor-pointer"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between gap-3 min-h-[60px] px-3 md:px-4 py-3 border-t border-(--border) shrink-0">
              <p className="text-xs text-(--muted) tabular-nums">
                {t("showing {{from}}-{{to}} of {{total}}", {
                  from: rangeStart,
                  to: rangeEnd,
                  total: totalCount,
                })}
              </p>
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center text-center gap-4 px-6 py-16">
            <div className="h-11 w-11 rounded-full border border-(--border) bg-(--bg-muted) flex items-center justify-center text-(--muted)">
              {isSearching ? <LuSearchX size={20} /> : <LuWallet size={20} />}
            </div>
            {isSearching ? (
              <>
                <p className="text-sm font-semibold">
                  {t("No incomes found matching your search")}
                </p>
                <Button
                  action={() => setSearchQuery("")}
                  text="Clear search"
                  variant="secondary"
                />
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">
                    {t("No incomes yet")}
                  </p>
                  <p className="text-sm text-(--muted)">
                    {t("You haven't added any incomes yet")}
                  </p>
                </div>
                <Button
                  action={handleAdd}
                  text="Add"
                  icon={<FiPlus size={16} />}
                />
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
