"use client";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { IoCloseOutline } from "react-icons/io5";
import Select from "./Select";
import {
  Currency,
  Language,
  UserAuthenticated,
  UserUpdatePayload,
} from "../AppTypes";
import { updateUser } from "../AppServices";
import { useTranslation } from "react-i18next";
import Button from "./Button";

export default function AccountSettingsDetail() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const {
    user,
    accountSettingsDetail,
    setAccountSettingsDetail,
    setToast,
    refreshUser,
  } = context;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currency: "USD" as Currency,
    language: "en" as Language,
  });

  function onClose() {
    setAccountSettingsDetail?.({ show: false });
  }

  async function submit() {
    setIsLoading(true);
    try {
      const payload: UserUpdatePayload = {
        name: formData.name || "",
        email: formData.email || "",
        currency: formData.currency,
        language: formData.language,
      };

      const res = await updateUser(user?.id || "", payload);

      if (res.error) {
        setToast?.({ message: res.error, status: "error", show: true });
        return;
      }

      if (res.user) {
        refreshUser?.(res.user as UserAuthenticated);
        setToast?.({
          message: res.message || "User updated successfully",
          status: "success",
          show: true,
        });
      }
      onClose();
    } catch (error) {
      setToast?.({
        message:
          error instanceof Error ? error.message : "Failed to save settings",
        status: "error",
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currency: user.currency || "USD",
        language: user.language || "en",
      });
    }
  }, [accountSettingsDetail.show]);

  if (!accountSettingsDetail.show) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-between w-full h-full sm:h-auto sm:w-md sm:border sm:border-(--border) sm:rounded-2xl bg-(--bg-secondary) shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] animate-modalGrow"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--border)">
          <h3 className="text-base font-semibold tracking-tight">
            {t("Account preferences")}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 rounded-lg text-(--muted) hover:text-(--foreground) hover:bg-(--bg-tertiary) transition-all duration-150"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        <div className="flex flex-col flex-1 gap-4 px-5 py-4 text-sm overflow-y-auto">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1">
              <label className="block text-xs text-(--muted) uppercase tracking-wider font-medium mb-2">
                {t("Currency")} *
              </label>

              <Select<Currency>
                value={formData.currency as Currency}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, currency: val }))
                }
                options={[
                  { value: "USD", label: "USD" },
                  { value: "EUR", label: "EUR" },
                  { value: "BRL", label: "BRL" },
                ]}
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs text-(--muted) uppercase tracking-wider font-medium mb-2">
                {t("Language")} *
              </label>
              <Select
                value={formData.language}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, language: val }))
                }
                options={[
                  { value: "en", label: "English" },
                  { value: "pt", label: "Portuguese" },
                  { value: "es", label: "Spanish" },
                ]}
              />
            </div>
          </div>

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

        <div className="flex items-center justify-end border-t border-(--border) px-5 py-4">
          <div className="flex items-center gap-2">
            <Button
              action={onClose}
              text="Cancel"
              className="bg-(--bg-tertiary) text-(--foreground)"
            />
            <Button
              action={submit}
              isLoading={isLoading}
              text="Save"
              className="bg-(--primary) hover:bg-(--primary-hover) text-[#0B0B0E] font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
