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
      className={`flex md:hidden items-center justify-between px-4 pt-4 animate-fadeIn`}
    >
      <Logo />
      <button
        onClick={() => setIsSidebarOpen?.(true)}
        className="cursor-pointer p-2 rounded-lg text-(--muted) hover:text-(--foreground) hover:bg-(--bg-secondary) transition duration-150 border border-(--border)"
      >
        <FiSidebar size={18} />
      </button>
    </div>
  );
}
