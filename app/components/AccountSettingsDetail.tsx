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
import Spin from "./Spin";
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#00000086] backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-between w-full h-full sm:h-auto sm:w-md sm:border sm:border-(--border) sm:rounded-2xl bg-(--bg-primary) animate-modalGrow"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
          <h3 className="text-base">{t("Account preferences")}</h3>
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
              <label className="block text-sm mb-2" htmlFor="category">
                {t("Currency")} *
              </label>

              <Select<Currency>
                value={formData.currency as Currency}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, currency: val }))
                }
                options={[
                  { value: "USD", label: "USD".toUpperCase() },
                  { value: "EUR", label: "EUR".toUpperCase() },
                  { value: "BRL", label: "BRL".toUpperCase() },
                ]}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm mb-2" htmlFor="language">
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

        <div className="flex items-center justify-end border-t border-(--border) px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              action={submit}
              isLoading={isLoading}
              text="Save"
              className="bg-(--primary)"
            />
            <Button
              action={onClose}
              text="Cancel"
              className="bg-(--bg-tertiary)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
