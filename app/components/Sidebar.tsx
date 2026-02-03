"use client";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { BsCreditCard2Back, BsWallet2 } from "react-icons/bs";
import AppContext from "../AppContext";
import Logo from "./Logo";
import { GoHome } from "react-icons/go";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user } = context;

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

  return (
    <div className="hidden sm:flex bg-(--background) fixed left-0 h-svh w-60 border-r border-(--color-border) p-6 flex-col justify-between gap-4 z-40 animate-fadeIn">
      <div className="flex flex-col gap-6">
        <Logo />
        <nav className="flex flex-col gap-3">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 ${
                  active ? "opacity-100" : "opacity-60"
                } hover:opacity-100 transition duration-200`}
              >
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center`}
                  style={{
                    backgroundColor: active
                      ? "var(--color-primary)"
                      : "var(--color-alt)",
                  }}
                >
                  {link.icon}
                </div>
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <LogoutButton />
    </div>
  );
}
