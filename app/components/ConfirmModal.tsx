"use client";
import { useContext } from "react";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";
import Button from "./Button";

export default function ConfirmModal() {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext is not provided");

  const { confirmAction, setConfirmAction } = context;

  if (!confirmAction.show) return null;

  function handleCancel() {
    setConfirmAction({ ...confirmAction, show: false });
  }

  function handleConfirm() {
    confirmAction.onConfirm();
    setConfirmAction({ ...confirmAction, show: false });
  }

  return (
    <div
      onClick={handleCancel}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-(--bg-secondary) border border-(--border) rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] w-full max-w-sm p-6 animate-modalGrow"
      >
        <h2 className="text-base font-semibold tracking-tight mb-2 text-(--foreground)">
          {t(confirmAction.title)}
        </h2>
        <p className="mb-6 text-sm text-(--muted) leading-relaxed">
          {t(confirmAction.message)}
        </p>
        <div className="flex justify-end gap-2">
          <Button
            action={handleCancel}
            text="Cancel"
            className="bg-(--bg-tertiary) text-(--foreground)"
          />
          <Button
            action={handleConfirm}
            text="Confirm"
            className="bg-(--danger) text-white font-semibold"
          />
        </div>
      </div>
    </div>
  );
}
