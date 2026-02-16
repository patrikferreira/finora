"use client";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { BsCreditCard2Back, BsWallet2 } from "react-icons/bs";
import AppContext from "../AppContext";
import Logo from "./Logo";
import Link from "next/link";
import Profile from "./Profile";
import { FiSidebar } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";

export default function Sidebar() {
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
    { name: "Overview", href: "/overview", icon: <RxDashboard size={18} /> },
    { name: "Incomes", href: "/incomes", icon: <BsWallet2 size={18} /> },
    {
      name: "Expenses",
      href: "/expenses",
      icon: <BsCreditCard2Back size={18} />,
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
      className={`bg-(--alt-color) h-full min-w-64 border-r border-(--border-color) p-2 flex-col justify-between gap-4 z-20 transition-all duration-200 ease-in-out animate-fadeIn ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 fixed md:relative top-0 left-0 flex`}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between p-2">
          <Logo />
          <button
            onClick={() => setIsSidebarOpen?.(false)}
            className="cursor-pointer md:hidden p-2 rounded-xl hover:bg-(--alt-color-2) transition duration-200"
          >
            <FiSidebar size={18} />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
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
                className={`flex items-center gap-2 rounded-full hover:bg-(--alt-color-2) transition duration-200 p-2 cursor-pointer ${
                  active ? "bg-(--alt-color-2) text-(--foreground)" : "text-(--alt-color-3)"
                }`}
              >
                <div className="p-1">{link.icon}</div>
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Profile />
    </div>
  );
}
