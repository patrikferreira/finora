"use client";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { LuUserRound } from "react-icons/lu";
import Popover from "./Popover";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { logoutUser } from "../AppServices";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, setToast, setIsSidebarOpen } = context;

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
      className="flex items-center gap-3 cursor-pointer relative w-full hover:bg-(--bg-tertiary) transition duration-200 p-2 rounded-xl"
    >
      <div className="h-9 w-9 bg-(--primary) rounded-full flex items-center justify-center">
        <LuUserRound className="text-(--background)" size={20} />
      </div>

      <div className="flex flex-col leading-tight">
        <span className="font-medium">{user?.name}</span>
        <span className="text-xs opacity-50">{user?.email}</span>
      </div>

      {menuOpen && (
        <Popover
          onClose={() => setMenuOpen(false)}
          className="bottom-14 left-0"
        >
          <div className="text-sm flex flex-col">
            <div className="flex flex-col p-3">
              <p className="text-md">{user?.name}</p>
              <span className="text-sm opacity-50">{user?.email}</span>
            </div>

            <hr className="border-(--border-secondary)" />
            <div className="flex flex-col p-1.5">
              <button className=" p-2 w-full hover:bg-(--bg-secondary) hover:text-(--foreground) transition duration-200 rounded-xl text-left cursor-pointer flex gap-2 items-center">
                <AiOutlineUser size={14} /> View profile
              </button>
              <button className=" p-2 w-full hover:bg-(--bg-secondary) hover:text-(--foreground) transition duration-200 rounded-xl text-left cursor-pointer flex gap-2 items-center">
                <IoSettingsOutline size={14} /> Account preferences
              </button>
            </div>

            <hr className="border-(--border-secondary)" />
            <div className="p-1.5">
              <button
                className="flex items-center gap-2 p-2 w-full  hover:bg-(--bg-secondary) hover:text-(--foreground) cursor-pointer  rounded-xl transition duration-200"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <IoLogOutOutline size={18} /> Logout
              </button>
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
}
