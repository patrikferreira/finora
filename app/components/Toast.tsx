"use client";
import { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
} from "react-icons/io5";

export type ToastStatus = "success" | "error" | "info";

const statusConfig: Record<
  ToastStatus,
  { icon: React.ReactNode; ring: string; color: string; bg: string }
> = {
  success: {
    icon: <IoCheckmarkCircle size={18} />,
    ring: "border-(--success)/40",
    color: "text-(--success)",
    bg: "bg-(--success)/20",
  },
  error: {
    icon: <IoCloseCircle size={18} />,
    ring: "border-(--danger)/40",
    color: "text-(--danger)",
    bg: "bg-(--danger)/20",
  },
  info: {
    icon: <IoInformationCircle size={18} />,
    ring: "border-(--warning)/40",
    color: "text-(--warning)",
    bg: "bg-(--warning)/20",
  },
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

  const config = statusConfig[(toast.status as ToastStatus) ?? "info"];

  return (
    <div className="fixed bottom-6 right-6 left-6 sm:left-auto sm:max-w-sm z-50 animate-slideInUp">
      <div
        className={`flex items-center gap-3 ${config.bg} border ${config.ring} px-4 py-3 rounded-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-sm`}
      >
        <span className={config.color}>{config.icon}</span>
        <span className="text-sm text-(--foreground) flex-1">
          {t(toast.message)}
        </span>
      </div>
    </div>
  );
}
