"use client";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import AppContext from "../AppContext";
import Logo from "./Logo";
import { FiSidebar } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, initialFetching, setIsSidebarOpen } = context;

  if (
    !user ||
    initialFetching ||
    pathname === "/signin" ||
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
        type="button"
        onClick={() => setIsSidebarOpen?.(true)}
        aria-label={t("Open menu")}
        className="cursor-pointer h-9 w-9 flex items-center justify-center rounded-xl text-(--muted) hover:text-(--foreground) bg-(--bg-secondary)/90 hover:bg-(--bg-muted) transition-colors duration-150 border border-(--border) shadow-sm backdrop-blur-sm"
      >
        <FiSidebar size={18} />
      </button>
    </div>
  );
}
