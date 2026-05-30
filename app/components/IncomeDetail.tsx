"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import AppContext from "../AppContext";
import { IoCloseOutline } from "react-icons/io5";
import { Cycle, Income, IncomeCategory } from "../AppTypes";
import Select from "./Select";
import { createIncome, deleteIncome, updateIncome } from "../AppServices";
import { validateIncomeForm } from "../utils/formValidators";
import { useTranslation } from "react-i18next";
import Button from "./Button";

export default function IncomeDetail() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<Income>({
    description: "",
    amount: null,
    category: "salary",
    cycle: "monthly",
  });

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const {
    incomeDetail,
    setIncomeDetail,
    setConfirmAction,
    setToast,
    user,
    setRefreshData,
  } = context;

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    BRL: "R$",
  };

  const currencySymbol = useMemo(() => {
    return user?.currency ? currencySymbols[user.currency] || "$" : "$";
  }, [user?.currency]);

  function resetData() {
    setFormData({
      description: "",
      amount: null,
      category: "salary",
      cycle: "monthly",
    });
  }

  function onClose() {
    resetData();
    setIncomeDetail({ ...incomeDetail, show: false });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    let newValue: string | boolean = value;

    if (type === "checkbox") {
      newValue = checked;
    }

    if (name === "amount" && typeof newValue === "string") {
      newValue = newValue.slice(0, 13);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }

  async function submit() {
    const formError = validateIncomeForm(formData);

    if (formError) {
      setToast({
        message: formError,
        status: "error",
        show: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: Income = {
        description: formData.description,
        amount: formData.amount,
        category: formData.category,
        cycle: formData.cycle,
        userId: user?.id || "",
      };

      let res;
      if (incomeDetail.newIncome) {
        res = await createIncome(payload);
      } else if (incomeDetail.currentIncome && incomeDetail.currentIncome.id) {
        res = await updateIncome(incomeDetail.currentIncome.id, payload);
      } else {
        throw new Error("Income id is missing for update");
      }

      if (res?.error) {
        setToast({
          message: res.error || "Failed to save income",
          status: "error",
          show: true,
        });
        return;
      }

      setToast({
        message: `Income ${
          incomeDetail.newIncome ? "created" : "updated"
        } successfully`,
        status: "success",
        show: true,
      });

      setRefreshData(true);
      onClose();
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to save income",
        status: "error",
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await deleteIncome(id);

    if (res.error) {
      setToast({
        message: res.error || "Failed to delete income",
        status: "error",
        show: true,
      });
      return;
    }

    setToast({
      message: "Income deleted successfully",
      status: "success",
      show: true,
    });
    setRefreshData(true);
    onClose();
  }

  async function handleDeleteClick() {
    setConfirmAction({
      show: true,
      title: "Delete Income",
      message:
        "Are you sure you want to delete this income? this action cannot be undone.",
      onConfirm: () => {
        if (incomeDetail.currentIncome?.id) {
          handleDelete(incomeDetail.currentIncome.id);
        }
      },
    });
  }

  useEffect(() => {
    if (!incomeDetail.show) return;

    if (incomeDetail.currentIncome) {
      setFormData({
        description: incomeDetail.currentIncome.description,
        amount: incomeDetail.currentIncome.amount ?? null,
        category: incomeDetail.currentIncome.category,
        cycle: incomeDetail.currentIncome.cycle,
      });
    }

    return () => {
      resetData();
    };
  }, [incomeDetail]);

  if (!incomeDetail.show) return null;

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
            {incomeDetail.newIncome ? t("New income") : t("Edit income")}
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
              <label
                className="block text-xs text-(--muted) uppercase tracking-wider font-medium mb-2"
                htmlFor="category"
              >
                {t("Category")} *
              </label>

              <Select<IncomeCategory>
                value={formData.category as IncomeCategory}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, category: val }))
                }
                options={[
                  { value: "salary", label: t("salary") },
                  { value: "benefit", label: t("benefit") },
                  { value: "investment", label: t("investment") },
                  { value: "freelancer", label: t("freelancer") },
                  { value: "business", label: t("business") },
                  { value: "other", label: t("other") },
                ]}
              />
            </div>

            <div className="flex-1">
              <label
                className="block text-xs text-(--muted) uppercase tracking-wider font-medium mb-2"
                htmlFor="category"
              >
                {t("Cycle")} *
              </label>

              <Select<Cycle>
                value={formData.cycle as Cycle}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, cycle: val }))
                }
                options={[
                  { value: "monthly", label: t("Monthly") },
                  { value: "yearly", label: t("Yearly") },
                ]}
              />
            </div>
          </div>
          <div>
            <label
              className="block text-xs text-(--muted) uppercase tracking-wider font-medium mb-2"
              htmlFor="description"
            >
              {t("Description")} *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Income"
              value={formData.description}
              onChange={handleChange}
              maxLength={50}
              autoFocus
              className="field"
            />
          </div>
          <div>
            <label
              className="block text-xs text-(--muted) uppercase tracking-wider font-medium mb-2"
              htmlFor="amount"
            >
              {t("Amount")} *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder={`${currencySymbol} 0.00`}
              value={formData.amount ?? ""}
              onChange={handleChange}
              className="field tabular"
            />
          </div>
        </div>

        <div
          className={`flex items-center ${
            incomeDetail.newIncome ? "justify-end" : "justify-between"
          } gap-2 border-t border-(--border) px-5 py-4`}
        >
          {!incomeDetail.newIncome && (
            <Button
              action={handleDeleteClick}
              text="Delete"
              className="bg-transparent border border-(--border) text-(--danger) hover:bg-(--danger-soft) hover:border-(--danger)/40"
            />
          )}
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
