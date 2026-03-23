import React, { useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";

type Props = {
  placeholder?: string;
};

export default function Search({ placeholder }: Props) {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { searchQuery, setSearchQuery } = context;

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
  }

  const hasQuery = searchQuery.trim().length > 0;

  return (
    <div
      className={`flex items-center gap-2 bg-(--bg-secondary) h-10 w-3xs py-1 px-3 rounded-full group border ${
        hasQuery ? "border-2 border-(--primary)" : "border-(--border)"
      } transition-all duration-200`}
    >
      <LuSearch
        size={18}
        className="opacity-50 group-hover:opacity-100 transition-all duration-200"
      />
      <input
        type="text"
        value={searchQuery}
        maxLength={50}
        onChange={handleSearch}
        className="
    !border-0
    !outline-none
    !ring-0
    focus:!border-0
    focus:!ring-0
    bg-(--bg-secondary)
    px-2
    py-1
    text-sm
    w-full
  "
        placeholder={placeholder || t("search...")}
      />
      <button onClick={() => setSearchQuery("")}>
        <IoIosClose
          size={20}
          className="opacity-50 hover:opacity-100 transition-all duration-200"
        />
      </button>
    </div>
  );
}
