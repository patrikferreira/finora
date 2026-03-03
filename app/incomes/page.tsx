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

type SortField = "description" | "amount" | "category" | "cycle";
type SortOrder = "asc" | "desc" | null;

const PAGE_SIZE = 10;

export default function Incomes() {
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
    setMenuOpen((prev) => (prev === id ? null : id ?? null));
  }

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

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

  const sortedIncomes = useMemo(() => {
    let filtered = localIncomes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (income) =>
          income.description?.toLowerCase().includes(query) ||
          income.category?.toLowerCase().includes(query) ||
          income.cycle?.toLowerCase().includes(query) ||
          income.amount?.toString().includes(query)
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
      className={`p-4 flex flex-col overflow-auto gap-4  w-full animate-fadeIn`}
    >
      {/* TITLE VIEW */}
      <div className="hidden md:flex flex-col">
        <h1 className="text-2xl font-semibold">Incomes</h1>
        <span className="opacity-50 text-sm">Track & manage your earnings</span>
      </div>

      {/* CONTROLS */}
      <Controls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* TABLE */}
      <div className="w-full rounded-xl border border-(--border-primary) hover:border-(--border-primary) overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("description")}
                className={`w-1/5 text-left bg-(--bg-secondary) tracking-wider border-(--border-primary) px-4 text-xs uppercase py-3 cursor-pointer transition-all ${
                  visibleIncomes.length === 0
                    ? "border-none"
                    : "border-b border-(--border-primary)"
                }`}
              >
                <div className="flex items-center gap-2">
                  Description
                  <SortIcon
                    field="description"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                onClick={() => handleSort("amount")}
                className={`w-1/5 text-left bg-(--bg-secondary)  tracking-wider font-semibold border-(--border-primary) px-4 text-xs uppercase py-3 cursor-pointer transition-all ${
                  visibleIncomes.length === 0
                    ? "border-none"
                    : "border-b border-(--border-primary)"
                }`}
              >
                <div className="flex items-center gap-2">
                  Amount
                  <SortIcon
                    field="amount"
                    sortField={sortField}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className={`w-1/5 text-left bg-(--bg-secondary)  tracking-wider font-semibold border-(--border-primary) px-4 text-xs uppercase hidden md:table-cell py-3 cursor-default transition-all ${
                  visibleIncomes.length === 0
                    ? "border-none"
                    : "border-b border-(--border-primary)"
                }`}
              >
                <div className="flex items-center gap-2">Category</div>
              </th>
              <th
                className={`w-1/5 text-left bg-(--bg-secondary)  tracking-wider font-semibold border-(--border-primary) px-4 text-xs uppercase hidden md:table-cell py-3 cursor-default transition-all ${
                  visibleIncomes.length === 0
                    ? "border-none"
                    : "border-b border-(--border-primary)"
                }`}
              >
                <div className="flex items-center gap-2">Cycle</div>
              </th>
              <th
                className={`w-1/10 text-left bg-(--bg-secondary) px-4 text-xs border-(--border-primary)  uppercase py-3 ${
                  visibleIncomes.length === 0
                    ? "border-none"
                    : "border-b border-(--border-primary)"
                }`}
              ></th>
            </tr>
          </thead>

          <tbody>
            {visibleIncomes.map((income, index) => (
              <tr
                key={income.id}
                className={`border-b border-(--border-primary) last:border-0 transition-all duration-300 bg-(--bg-secondary)`}
              >
                <td className="w-1/5 px-4 py-3 text-sm truncate">
                  {income.description}
                </td>
                <td className="w-1/5 px-4 py-3 text-sm">
                  €{(income.amount ?? "").toLocaleString()}
                </td>
                <td className="w-1/5 px-4 py-3 text-sm hidden md:table-cell">
                  {income?.category
                    ? income.category.charAt(0).toUpperCase() +
                      income.category.slice(1)
                    : ""}
                </td>
                <td className="w-1/5 px-4 py-3 text-sm hidden md:table-cell">
                  {income?.cycle
                    ? income.cycle.charAt(0).toUpperCase() +
                      income.cycle.slice(1)
                    : ""}
                </td>
                <td className="w-1/10 px-4 text-sm">
                  <button
                    onClick={() => handleMenu(income.id)}
                    className="border border-transparent opacity-50 hover:opacity-100 hover:border-(--border-primary) group transition-all duration-300 cursor-pointer rounded-xl p-2"
                  >
                    <HiMiniEllipsisVertical className=" group-hover:text-(--foreground) transition-all duration-300" />
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
                          className=" p-2 w-full hover:bg-(--bg-secondary) hover:text-(--foreground) transition duration-200 rounded-xl text-left cursor-pointer flex gap-2 items-center"
                        >
                          <FaRegEdit /> Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteClick(income.id);
                          }}
                          className="p-2 w-full hover:bg-(--bg-secondary) hover:text-(--foreground) transition duration-200 rounded-xl text-left cursor-pointer flex gap-2 items-center"
                        >
                          <FaRegTrashCan /> Delete
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
        <div className="px-4 text-sm w-max cursor-default opacity-50 hover:opacity-100 transition duration-200 flex items-center gap-2">
          <IoInformationCircleOutline />
          <span>{`Showing ${visibleIncomes.length} of ${sortedIncomes.length}`}</span>
        </div>
      ) : (
        <div className="px-4 text-sm w-max cursor-default  hover:text-(--foreground) transition duration-200 flex items-center gap-2">
          <IoInformationCircleOutline />
          {searchQuery.trim()
            ? "No incomes found matching your search"
            : "You haven't added any incomes yet"}
        </div>
      )}
    </div>
  );
}
