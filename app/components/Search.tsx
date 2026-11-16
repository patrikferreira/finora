import React, { useContext, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

type Props = {
  placeholder?: string;
};

export default function Search({ placeholder }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { searchQuery, setSearchQuery } = context;

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
  }

  useEffect(() => {
    setSearchQuery("");
  }, [router]);

  const hasQuery = searchQuery.trim().length > 0;

  return (
    <div
      className={`flex items-center gap-2 bg-(--bg-muted) h-9 w-full max-w-xs px-3 rounded-xl group border shadow-sm transition-all duration-150 focus-within:border-(--primary) focus-within:bg-(--bg-secondary) focus-within:shadow-[0_0_0_4px_var(--primary-soft)] ${
        hasQuery
          ? "border-(--primary) bg-(--bg-secondary)"
          : "border-(--border)"
      }`}
    >
      <LuSearch
        size={16}
        className={`transition-colors duration-150 ${
          hasQuery ? "text-(--primary)" : "text-(--muted)"
        }`}
      />
      <input
        type="text"
        value={searchQuery}
        maxLength={50}
        onChange={handleSearch}
        className="!border-0 !outline-none !ring-0 focus:!border-0 focus:!ring-0 bg-transparent text-sm w-full placeholder:text-(--placeholder)"
        placeholder={placeholder || t("search...")}
      />
      {hasQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          aria-label={t("Clear search")}
          className="text-(--muted) hover:text-(--foreground) transition-colors cursor-pointer"
        >
          <IoIosClose size={20} />
        </button>
      )}
    </div>
  );
}
