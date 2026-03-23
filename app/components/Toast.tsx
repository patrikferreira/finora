"use client";
import { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";

export type ToastStatus = "success" | "error" | "info";

const toastStatusColors: Record<ToastStatus, string> = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  info: "bg-yellow-100 text-yellow-700",
};

export default function Toast() {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext is not provided");

  const { toast, setToast } = context;

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  if (!toast.show) return null;

  const statusClasses =
    toastStatusColors[(toast.status as ToastStatus) ?? "info"];

  return (
    <div
      className={`fixed bottom-6 right-6 ${statusClasses} px-4 py-2 rounded-full shadow-md z-50`}
    >
      {t(toast.message)}
    </div>
  );
}
