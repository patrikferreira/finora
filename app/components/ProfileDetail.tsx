"use client";
import { useContext } from "react";
import AppContext from "../AppContext";
import { IoCloseOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Button from "./Button";

export default function ProfileDetail() {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { user, profileDetail, setProfileDetail } = context;

  function onClose() {
    setProfileDetail?.({ show: false });
  }

  if (!profileDetail.show) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-between w-full h-full sm:h-auto sm:w-sm sm:border sm:border-(--border) sm:rounded-2xl bg-(--bg-secondary) shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] animate-modalGrow"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--border)">
          <h3 className="text-base font-semibold tracking-tight">
            {t("Profile")}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-lg text-(--muted) hover:text-(--foreground) hover:bg-(--bg-tertiary) transition-all duration-150"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        <div className="flex flex-col flex-1 gap-4 px-5 py-4 text-sm overflow-y-auto">
          <div>
            <label className="block text-xs text-(--muted) uppercase tracking-wider font-medium mb-1.5">
              {t("Name")}
            </label>
            <p className="text-(--foreground)">{user?.name}</p>
          </div>

          <div>
            <label className="block text-xs text-(--muted) uppercase tracking-wider font-medium mb-1.5">
              {t("Email")}
            </label>
            <p className="text-(--foreground)">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-end px-5 py-4 border-t border-(--border)">
          <Button
            action={onClose}
            text="Close"
            className="bg-(--bg-tertiary) text-(--foreground)"
          />
        </div>
      </div>
    </div>
  );
}
