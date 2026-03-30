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
    [setTrialPeriodAlert]
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#00000086] backdrop-blur-sm"
      role="presentation"
    >
      <div>
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="alert-title"
          aria-describedby="alert-desc"
          className="bg-(--bg-secondary) rounded-3xl p-6 w-80 sm:w-96 shadow-xl transition-all duration-200 ease-out flex flex-col gap-6"
        >
          <div className="flex items-center gap-2">
            <IoAlertCircleOutline size={30} className="text-orange-400" />
            <h2 className="text-xl">
              {t("Trial period")}
            </h2>
          </div>
          <p id="alert-desc" className="">
            {t(
              "you are currently using a trial period, and your account will be deleted the following day"
            )}
          </p>
          <div className="flex justify-end">
            <button
              onClick={close}
              className="px-4 py-2 rounded-2xl bg-(--bg-tertiary) hover:brightness-115  cursor-pointer transition-all duration-200 text-sm"
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
