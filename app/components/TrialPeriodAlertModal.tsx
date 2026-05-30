"use client";
import { useContext, useEffect, useRef, useCallback } from "react";
import AppContext from "../AppContext";
import { IoAlertCircleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export default function TrialPeriodAlertModal() {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext is not provided");

  const { trialPeriodAlert, setTrialPeriodAlert } = context;

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(
    () => setTrialPeriodAlert?.(false),
    [setTrialPeriodAlert],
  );

  useEffect(() => {
    if (trialPeriodAlert === false) return;
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trialPeriodAlert, close]);

  if (trialPeriodAlert === false) return null;

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-desc"
        className="bg-(--bg-secondary) border border-(--border) rounded-2xl p-6 w-full max-w-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] animate-modalGrow flex flex-col gap-5"
      >
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: "var(--warning-soft)",
              color: "var(--warning)",
            }}
          >
            <IoAlertCircleOutline size={22} />
          </div>
          <h2
            id="alert-title"
            className="text-base font-semibold tracking-tight"
          >
            {t("Trial period")}
          </h2>
        </div>
        <p id="alert-desc" className="text-sm text-(--muted) leading-relaxed">
          {t(
            "you are currently using a trial period, and your account will be deleted the following day",
          )}
        </p>
        <div className="flex justify-end">
          <button
            ref={closeBtnRef}
            onClick={close}
            className="px-4 h-10 rounded-xl bg-(--bg-tertiary) text-(--foreground) hover:brightness-115 cursor-pointer transition-all duration-150 text-sm font-medium"
          >
            {t("Close")}
          </button>
        </div>
      </div>
    </div>
  );
}
