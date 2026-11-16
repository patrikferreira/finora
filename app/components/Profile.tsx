"use client";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { LuChevronsUpDown, LuUserRound } from "react-icons/lu";
import Popover from "./Popover";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { logoutUser } from "../AppServices";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type Props = {
  collapsed?: boolean;
};

function getInitials(name?: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

export default function Profile({ collapsed = false }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const {
    user,
    setToast,
    setIsSidebarOpen,
    setUser,
    setProfileDetail,
    setAccountSettingsDetail,
  } = context;

  async function handleLogout() {
    setIsLoading(true);
    try {
      const { error } = await logoutUser();
      if (error) {
        console.error("Logout failed:", error);
        setToast({
          message: "Logout failed",
          status: "error",
          show: true,
        });
      } else {
        router.push("/signin");
        setIsSidebarOpen?.(false);
        setUser?.(undefined);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const initials = getInitials(user?.name);
  const avatar = (
    <span className="h-9 w-9 shrink-0 rounded-xl bg-(--primary) text-(--on-primary) shadow-(--shadow-button) flex items-center justify-center text-xs font-bold">
      {initials || <LuUserRound size={18} />}
    </span>
  );

  const hideWhenCollapsed = `transition-opacity duration-150 ${
    collapsed ? "md:opacity-0" : ""
  }`;
  const itemClass =
    "h-9 px-2 w-full text-(--muted) hover:bg-(--bg-muted) hover:text-(--foreground) transition-colors duration-150 rounded-lg text-left cursor-pointer flex gap-2 items-center";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        onMouseDown={(e) => e.stopPropagation()}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        title={collapsed ? user?.name : undefined}
        className={`w-full flex items-center gap-2.5 p-1 rounded-xl text-left cursor-pointer overflow-hidden transition-colors duration-150 hover:bg-(--bg-muted) ${
          menuOpen ? "bg-(--bg-muted)" : ""
        }`}
      >
        {avatar}
        <span
          className={`flex flex-col leading-tight min-w-0 flex-1 ${hideWhenCollapsed}`}
        >
          <span className="font-medium text-sm truncate">{user?.name}</span>
          <span className="text-xs text-(--muted) truncate">{user?.email}</span>
        </span>
        <LuChevronsUpDown
          size={14}
          className={`shrink-0 mr-1.5 text-(--muted) ${hideWhenCollapsed}`}
        />
      </button>

      {menuOpen && (
        <Popover
          onClose={() => setMenuOpen(false)}
          className={`bottom-full mb-2 left-0 !w-full min-w-56 ${
            collapsed ? "md:!w-56" : ""
          }`}
        >
          <div className="text-sm flex flex-col">
            <div className="flex items-center gap-3 p-3">
              {avatar}
              <div className="flex flex-col min-w-0 leading-tight">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <span className="text-xs text-(--muted) truncate">
                  {user?.email}
                </span>
              </div>
            </div>

            <hr className="border-(--border)" />
            <div className="flex flex-col p-1.5">
              <button
                type="button"
                onClick={() => {
                  setProfileDetail?.({ show: true });
                  setMenuOpen(false);
                }}
                className={itemClass}
              >
                <AiOutlineUser size={14} /> {t("View profile")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountSettingsDetail?.({ show: true });
                  setMenuOpen(false);
                }}
                className={itemClass}
              >
                <IoSettingsOutline size={14} /> {t("Account preferences")}
              </button>
            </div>

            <hr className="border-(--border)" />
            <div className="p-1.5">
              <button
                type="button"
                className={`${itemClass} hover:!text-(--danger)`}
                onClick={handleLogout}
                disabled={isLoading}
              >
                <IoLogOutOutline size={16} /> {t("Logout")}
              </button>
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
}
