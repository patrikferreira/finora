"use client";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import AppContext from "../AppContext";
import Logo from "./Logo";
import { FiSidebar } from "react-icons/fi";

export default function Header() {
  const pathname = usePathname();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, initialFetching, setIsSidebarOpen } = context;

  if (
    !user ||
    initialFetching ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/"
  ) {
    return null;
  }

  return (
    <div
      className={`bg-(--background) flex md:hidden  items-center px-4 pt-4 animate-fadeIn`}
    >
      <div className={`flex items-center gap-4 animate-fadeIn`}>
        <button>
          <Logo logoOnly={true} />
        </button>
        <button
          onClick={() => setIsSidebarOpen?.(true)}
          className="cursor-pointer p-2 rounded-xl hover:bg-(--alt-color) transition duration-200"
        >
          <FiSidebar size={18} />
        </button>
      </div>
    </div>
  );
}
