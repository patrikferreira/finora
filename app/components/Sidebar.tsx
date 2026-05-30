"use client";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import AppContext from "../AppContext";
import Logo from "./Logo";
import Link from "next/link";
import Profile from "./Profile";
import { FiSidebar } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineDownload } from "react-icons/hi";
import { TbMoneybag } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, initialFetching, isSidebarOpen, setIsSidebarOpen } = context;

  function closeSidebar() {
    setIsSidebarOpen?.(false);
  }

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isSidebarOpen &&
        window.innerWidth < 1024
      ) {
        setIsSidebarOpen?.(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  const links = [
    { name: "overview", href: "/overview", icon: <RxDashboard size={18} /> },
    { name: "incomes", href: "/incomes", icon: <TbMoneybag size={18} /> },
    {
      name: "expenses",
      href: "/expenses",
      icon: <HiOutlineDownload size={18} />,
    },
  ];

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
      ref={sidebarRef}
      className={`bg-(--bg-secondary) h-full min-w-[244px] border-r border-(--border) p-3 flex-col justify-between gap-4 z-20 transition-all duration-200 ease-in-out animate-fadeIn ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 fixed md:relative top-0 left-0 flex`}
    >
      <div className="flex flex-col gap-7">
        <div className="flex items-center justify-between px-2 pt-2">
          <Logo />
          <button
            onClick={() => setIsSidebarOpen?.(false)}
            className="cursor-pointer md:hidden p-2 rounded-lg text-(--muted) hover:text-(--foreground) hover:bg-(--bg-tertiary) transition duration-150"
          >
            <FiSidebar size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="px-3 text-[10px] uppercase tracking-wider text-(--muted) font-medium">
            {t("Menu")}
          </p>
          <nav className="flex flex-col gap-0.5">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      closeSidebar();
                    }
                  }}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition duration-150 cursor-pointer group ${
                    active
                      ? "bg-(--bg-tertiary) text-(--foreground)"
                      : "text-(--muted) hover:text-(--foreground) hover:bg-(--bg-tertiary)/60"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-(--primary)" />
                  )}
                  <span
                    className={`flex items-center justify-center ${
                      active ? "text-(--primary)" : ""
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span className="font-medium">{t(link.name)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <Profile />
    </div>
  );
}
