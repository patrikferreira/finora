"use client";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import Logo from "./Logo";
import Link from "next/link";
import Profile from "./Profile";
import { FiChevronLeft, FiX } from "react-icons/fi";
import { LuArrowDown, LuArrowUp, LuLayoutDashboard } from "react-icons/lu";
import { useTranslation } from "react-i18next";

const COLLAPSED_KEY = "finora:sidebar-collapsed";

function readCollapsed() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

const links = [
  { name: "overview", href: "/overview", icon: <LuLayoutDashboard size={18} /> },
  { name: "incomes", href: "/incomes", icon: <LuArrowUp size={18} /> },
  { name: "expenses", href: "/expenses", icon: <LuArrowDown size={18} /> },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsed);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, initialFetching, isSidebarOpen, setIsSidebarOpen } = context;

  function closeSidebar() {
    setIsSidebarOpen?.(false);
  }

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
    } catch {
    }
  }

  if (
    !user ||
    initialFetching ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/"
  ) {
    return null;
  }

  const labelClass = `transition-opacity duration-150 ${
    collapsed ? "md:opacity-0" : ""
  }`;
  const toggleLabel = collapsed ? t("Expand sidebar") : t("Collapse sidebar");

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label={t("Close menu")}
          onClick={closeSidebar}
          className="fixed inset-0 z-20 bg-(--overlay) backdrop-blur-sm md:hidden animate-fadeIn"
        />
      )}

      <div
        aria-hidden
        className={`hidden md:block shrink-0 transition-[width] duration-200 ease-out motion-reduce:transition-none ${
          collapsed ? "w-20" : "w-[252px]"
        }`}
      />

      <aside
        className={`fixed top-3 bottom-3 left-3 z-30 flex flex-col justify-between gap-4 w-64 p-3 rounded-2xl border border-(--border)/80 bg-(--bg-secondary)/90 backdrop-blur-xl shadow-(--shadow-float) transition-[width,translate,visibility] duration-200 ease-out motion-reduce:transition-none animate-fadeIn ${
          isSidebarOpen
            ? "translate-x-0 visible"
            : "-translate-x-[calc(100%+1.5rem)] invisible"
        } md:translate-x-0 md:visible ${collapsed ? "md:w-[68px]" : "md:w-60"}`}
      >
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          title={toggleLabel}
          className="hidden md:flex absolute top-5 -right-3 h-6 w-6 items-center justify-center rounded-full border border-(--border) bg-(--bg-secondary) text-(--muted) hover:text-(--primary) hover:border-(--primary) shadow-sm cursor-pointer transition-colors duration-150"
        >
          <FiChevronLeft
            size={14}
            className={`transition-transform duration-200 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="flex flex-col gap-6 min-w-0">
          <div className="flex items-center justify-between h-10">
            <div className="pl-[9px] overflow-hidden">
              <Logo />
            </div>
            <button
              type="button"
              onClick={closeSidebar}
              aria-label={t("Close menu")}
              className="md:hidden h-8 w-8 shrink-0 flex items-center justify-center rounded-md text-(--muted) hover:text-(--foreground) hover:bg-(--bg-muted) cursor-pointer transition-colors duration-150"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <p
              className={`pl-[13px] h-4 overflow-hidden whitespace-nowrap text-[10px] uppercase tracking-wider text-(--muted) font-semibold ${labelClass}`}
            >
              {t("Menu")}
            </p>
            <nav className="flex flex-col gap-1">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        closeSidebar();
                      }
                    }}
                    className={`group relative block h-10 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                      active
                        ? "bg-(--primary-soft) text-(--primary) shadow-sm"
                        : "text-(--muted) hover:text-(--foreground) hover:bg-(--bg-muted)"
                    }`}
                  >
                    <span className="flex items-center h-full overflow-hidden whitespace-nowrap">
                      <span className="w-11 shrink-0 flex items-center justify-center">
                        {link.icon}
                      </span>
                      <span className={labelClass}>{t(link.name)}</span>
                    </span>

                    {collapsed && (
                      <span
                        aria-hidden
                        className="hidden md:block pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 rounded-md bg-(--foreground) text-(--bg-secondary) text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150"
                      >
                        {t(link.name)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <Profile collapsed={collapsed} />
      </aside>
    </>
  );
}
