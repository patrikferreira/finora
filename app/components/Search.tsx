import React, { useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import AppContext from "../AppContext";

type Props = {
  placeholder?: string;
};

export default function Search({ placeholder }: Props) {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { searchQuery, setSearchQuery } = context;

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
  }

  return (
    <div
      className={`flex items-center gap-2 bg-(--alt-color) h-10 w-3xs py-1 px-3 rounded-full group border border-(--border-color) hover:border-(--border-color-2) transition-all duration-200`}
    >
      <LuSearch
        size={18}
        className="text-(--alt-color-3) group-hover:text-(--foreground) transition-all duration-200"
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
    bg-(--alt-color)
    px-2
    py-1
    text-sm
    w-full
  "
        placeholder={placeholder || "Search..."}
      />
      <button onClick={() => setSearchQuery("")}>
        <IoIosClose
          size={20}
          className="text-(--alt-color-3) hover:text-(--foreground) transition-all duration-200"
        />
      </button>
    </div>
  );
}
