"use client";
import { useContext } from "react";
import AppContext from "../AppContext";

export default function ConfirmModal() {
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
      className="fixed inset-0 bg-[#00000086] bg-opacity-30 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-(--bg-secondary) rounded-xl shadow-lg w-full max-w-sm p-6"
      >
        <h2 className="text-lg font-semibold mb-2 text-[var(--foreground)]">
          {confirmAction.title}
        </h2>
        <p className="mb-4">{confirmAction.message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl bg-(--bg-tertiary) hover:brightness-115  cursor-pointer transition-all duration-200 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:brightness-90 cursor-pointer transition-all duration-200 text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
