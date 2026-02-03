"use client";
import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { LuUserRound } from "react-icons/lu";
import Popover from "./Popover";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import LogoutButton from "./LogoutButton";

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  function handleMenu() {
    setMenuOpen((prev) => !prev);
  }

  const { user } = context;
  return (
    <div
      onClick={handleMenu}
      className="flex items-center gap-3 cursor-pointer relative w-max"
    >
      <div className="h-8 w-8 bg-(--color-primary) rounded-full flex items-center justify-center">
        <LuUserRound size={20} />
      </div>

      {menuOpen && (
        <Popover onClose={() => setMenuOpen(false)} className="top-10 right-0">
          <div className="text-xs flex flex-col">
            <div className="flex flex-col p-3">
              <p className="text-sm">{user?.name}</p>
              <span className="text-xs opacity-60">{user?.email}</span>
            </div>

            <hr className="border-(--color-border)" />
            <div className="flex flex-col p-1.5">
              <button className="text-zinc-400 p-2 w-full hover:bg-(--background) hover:text-(--foreground) transition duration-200 rounded-xl text-left cursor-pointer flex gap-2 items-center">
                <AiOutlineUser size={14} /> View profile
              </button>
              <button className="text-zinc-400 p-2 w-full hover:bg-(--background) hover:text-(--foreground) transition duration-200 rounded-xl text-left cursor-pointer flex gap-2 items-center">
                <IoSettingsOutline size={14} /> Account preferences
              </button>
            </div>

            <hr className="border-(--color-border)" />
            <div className="p-3 w-full">
              <LogoutButton />
            </div>
          </div>
        </Popover>
      )}
    </div>
  );
}
