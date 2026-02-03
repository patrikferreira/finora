"use client";
import { usePathname } from "next/navigation";
import Profile from "./Profile";
import { useContext } from "react";
import AppContext from "../AppContext";
import { GoHome } from "react-icons/go";
import { BsCreditCard2Back, BsWallet2 } from "react-icons/bs";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, setIsSidebarOpen, isSidebarOpen } = context;

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <GoHome size={18} /> },
    { name: "Incomes", href: "/incomes", icon: <BsWallet2 size={14} /> },
    {
      name: "Expenses",
      href: "/expenses",
      icon: <BsCreditCard2Back size={14} />,
    },
  ];

  if (
    !user ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/"
  ) {
    return null;
  }

  const current = links.find(
    (l) => pathname === l.href || pathname.startsWith(l.href + "/")
  );

  return (
    <div className="sm:ml-60 h-16 bg-(--background)  fixed top-0 left-0 right-0 flex justify-between items-center px-6 z-30 animate-fadeIn">
      <div className="flex items-center gap-4">
        <div className="sm:hidden cursor-pointer" onClick={() => setIsSidebarOpen?.(!isSidebarOpen)}>
          <Logo logoOnly={true} />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="opacity-60 flex items-center">{current?.icon}</span>
          <span className="opacity-100">{current?.name ?? pathname}</span>
        </div>
      </div>
      <Profile />
    </div>
  );
}
