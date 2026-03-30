"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import AppContext from "../AppContext";
import { IoCloseOutline } from "react-icons/io5";
import { Cycle, Expense, ExpenseCategory } from "../AppTypes";
import Spin from "./Spin";
import Select from "./Select";
import { createExpense, deleteExpense, updateExpense } from "../AppServices";
import { validateExpenseForm } from "../utils/formValidators";
import { useTranslation } from "react-i18next";
import Button from "./Button";

export default function ExpenseDetail() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<Expense>({
    description: "",
    amount: null,
    category: "house",
    cycle: "monthly",
  });

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const {
    expenseDetail,
    setExpenseDetail,
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
      category: "house",
      cycle: "monthly",
    });
  }

  function onClose() {
    resetData();
    setExpenseDetail({ ...expenseDetail, show: false });
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
    const formError = validateExpenseForm(formData);

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
      const payload: Expense = {
        description: formData.description,
        amount: formData.amount,
        category: formData.category,
        cycle: formData.cycle,
        userId: user?.id || "",
      };

      let res;
      if (expenseDetail.newExpense) {
        res = await createExpense(payload);
      } else if (
        expenseDetail.currentExpense &&
        expenseDetail.currentExpense.id
      ) {
        res = await updateExpense(expenseDetail.currentExpense.id, payload);
      } else {
        throw new Error("Expense id is missing for update");
      }

      if (res?.error) {
        setToast({
          message: res.error || "Failed to save expense",
          status: "error",
          show: true,
        });
        return;
      }

      setToast({
        message: `Expense ${
          expenseDetail.newExpense ? "created" : "updated"
        } successfully`,
        status: "success",
        show: true,
      });

      setRefreshData(true);
      onClose();
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to save expense",
        status: "error",
        show: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await deleteExpense(id);

    if (res.error) {
      setToast({
        message: res.error || "Failed to delete expense",
        status: "error",
        show: true,
      });
      return;
    }

    setToast({
      message: "Expense deleted successfully",
      status: "success",
      show: true,
    });
    setRefreshData(true);
    onClose();
  }

  async function handleDeleteClick() {
    setConfirmAction({
      show: true,
      title: "Delete Expense",
      message:
        "Are you sure you want to delete this expense? This action cannot be undone.",
      onConfirm: () => {
        if (expenseDetail.currentExpense?.id) {
          handleDelete(expenseDetail.currentExpense.id);
        }
      },
    });
  }

  useEffect(() => {
    if (!expenseDetail.show) return;

    if (expenseDetail.currentExpense) {
      setFormData({
        description: expenseDetail.currentExpense.description,
        amount: expenseDetail.currentExpense.amount ?? null,
        category: expenseDetail.currentExpense.category,
        cycle: expenseDetail.currentExpense.cycle,
      });
    }

    return () => {
      resetData();
    };
  }, [expenseDetail]);

  if (!expenseDetail.show) return null;

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
          <h3 className="text-base">
            {expenseDetail.newExpense ? t("New expense") : t("Edit expense")}
          </h3>
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
                {t("Category")} *
              </label>

              <Select<ExpenseCategory>
                value={formData.category as ExpenseCategory}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, category: val }))
                }
                options={[
                  { value: "house", label: t("house") },
                  { value: "transport", label: t("transport") },
                  { value: "food", label: t("food") },
                  { value: "entertainment", label: t("entertainment") },
                  { value: "health", label: t("health") },
                  { value: "education", label: t("education") },
                  { value: "investment", label: t("investment") },
                  { value: "subscription", label: t("subscription") },
                  { value: "saving", label: t("saving") },
                  { value: "other", label: t("other") },
                ]}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm mb-2" htmlFor="cycle">
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
            <label className="block text-sm mb-2" htmlFor="description">
              {t("Description")} *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Expense"
              value={formData.description}
              onChange={handleChange}
              maxLength={50}
              autoFocus
              className="w-full bg-(--bg-secondary) border border-(--border) rounded-2xl px-4 py-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2" htmlFor="amount">
              {t("Amount")} *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder={`${currencySymbol} 0.00`}
              value={formData.amount ?? ""}
              onChange={handleChange}
              className="w-full bg-(--bg-secondary) border border-(--border) rounded-2xl px-4 py-2.5 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div
          className={`flex items-center ${
            expenseDetail.newExpense ? "justify-end" : "justify-between"
          } gap-2 border-t border-(--border) px-4 py-3`}
        >
          {!expenseDetail.newExpense && (
            <Button
              action={handleDeleteClick}
              text="Delete"
              className="bg-(--bg-tertiary)"
            />
          )}
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
