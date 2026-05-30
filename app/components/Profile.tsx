"use client";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { LuUserRound } from "react-icons/lu";
import Popover from "./Popover";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { logoutUser } from "../AppServices";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Profile() {
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

  function handleMenu() {
    setMenuOpen((prev) => !prev);
  }

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
        router.push("/login");
        setIsSidebarOpen?.(false);
        setUser?.(undefined);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      onClick={handleMenu}
      className="flex items-center gap-3 cursor-pointer relative w-full hover:bg-(--bg-tertiary) transition duration-150 p-2 rounded-xl border border-transparent hover:border-(--border)"
    >
      <div className="h-9 w-9 bg-gradient-to-br from-[#3FD693] to-[#2EA470] rounded-lg flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(54,189,129,0.5)] flex-shrink-0">
        <LuUserRound className="text-[#0B0B0E]" size={18} />
      </div>

      <div className="flex flex-col leading-tight min-w-0 flex-1">
        <span className="font-medium text-sm truncate">{user?.name}</span>
        <span className="text-xs text-(--muted) truncate">{user?.email}</span>
      </div>

      {menuOpen && (
        <Popover
          onClose={() => setMenuOpen(false)}
          className="bottom-14 left-0"
        >
          <div className="text-sm flex flex-col">
            <div className="flex items-center gap-3 p-3">
              <div className="h-9 w-9 bg-gradient-to-br from-[#3FD693] to-[#2EA470] rounded-lg flex items-center justify-center flex-shrink-0">
                <LuUserRound className="text-[#0B0B0E]" size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <span className="text-xs text-(--muted) truncate">
                  {user?.email}
                </span>
              </div>
            </div>

            <hr className="border-(--border)" />
            <div className="flex flex-col p-1.5">
              <button
                onClick={() => {
                  setProfileDetail?.({ show: true });
                }}
                className="p-2 w-full text-(--muted) hover:bg-(--bg-tertiary) hover:text-(--foreground) transition duration-150 rounded-lg text-left cursor-pointer flex gap-2 items-center"
              >
                <AiOutlineUser size={14} /> {t("View profile")}
              </button>
              <button
                onClick={() => {
                  setAccountSettingsDetail?.({ show: true });
                }}
                className="p-2 w-full text-(--muted) hover:bg-(--bg-tertiary) hover:text-(--foreground) transition duration-150 rounded-lg text-left cursor-pointer flex gap-2 items-center"
              >
                <IoSettingsOutline size={14} /> {t("Account preferences")}
              </button>
            </div>

            <hr className="border-(--border)" />
            <div className="p-1.5">
              <button
                className="flex items-center gap-2 p-2 w-full text-(--muted) hover:bg-(--danger-soft) hover:text-(--danger) cursor-pointer rounded-lg transition duration-150"
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
