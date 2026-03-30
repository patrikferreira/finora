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
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#00000086] backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-between w-full h-full sm:h-auto sm:w-sm sm:border sm:border-(--border) sm:rounded-2xl bg-(--bg-primary) animate-modalGrow"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
          <h3 className="text-base">{t("Profile")}</h3>
          <button
            onClick={onClose}
            className="cursor-pointer opacity-50 hover:opacity-100 transition-all duration-200"
          >
            <IoCloseOutline size={18} />
          </button>
        </div>

        <div className="flex flex-col flex-1 gap-4 px-4 py-3 text-sm overflow-y-auto">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <label className="block text-sm mb-2" htmlFor="name">
                {t("Name")}
              </label>
              <p className="opacity-50">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <label className="block text-sm mb-2" htmlFor="email">
                {t("Email")}
              </label>
              <p className="opacity-50">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-4 py-3 border-t border-(--border)">
          <Button
            action={onClose}
            text="Close"
            className="bg-(--bg-tertiary)"
          />
        </div>
      </div>
    </div>
  );
}
