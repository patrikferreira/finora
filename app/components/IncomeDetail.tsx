"use client";
import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { IoCloseOutline } from "react-icons/io5";
import { BillingCycle, Income, IncomeCategory } from "../AppTypes";
import Spin from "./Spin";
import Select from "./Select";
import { createIncome, deleteIncome } from "../AppServices";
import { validateIncomeForm } from "../utils/formValidators";

export default function IncomeDetail() {
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

      const res = await createIncome(payload);

      if (res.error) {
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
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#00000086] backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-between w-full h-full sm:h-auto sm:w-md border border-(--border-primary) sm:rounded-xl bg-(--bg-primary) animate-modalGrow"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-(--border-primary)">
          <h3 className="text-base">
            {incomeDetail.newIncome ? "New income" : "Edit income"}
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
                Category *
              </label>

              <Select<IncomeCategory>
                value={formData.category as IncomeCategory}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, category: val }))
                }
                options={[
                  { value: "salary", label: "Salary" },
                  { value: "benefit", label: "Benefit" },
                  { value: "investment", label: "Investment" },
                  { value: "freelancer", label: "Freelancer" },
                  { value: "business", label: "Business" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm mb-2" htmlFor="category">
                Cycle *
              </label>

              <Select<BillingCycle>
                value={formData.cycle as BillingCycle}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, cycle: val }))
                }
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                ]}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2" htmlFor="description">
              Description *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Income"
              value={formData.description}
              onChange={handleChange}
              autoFocus
              className="w-full bg-(--bg-secondary) border border-(--border-primary) rounded-xl px-4 py-2.5 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-2" htmlFor="amount">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="$"
              value={formData.amount ?? ""}
              onChange={handleChange}
              className="w-full bg-(--bg-secondary) border border-(--border-primary) rounded-xl px-4 py-2.5 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div
          className={`flex items-center ${
            incomeDetail.newIncome ? "justify-end" : "justify-between"
          } gap-2 border-t border-(--border-primary) px-4 py-3`}
        >
          {!incomeDetail.newIncome && (
            <button
              onClick={handleDeleteClick}
              className="h-9 px-3 text-sm rounded-xl bg-(--bg-tertiary) cursor-pointer transition duration-200 hover:brightness-115"
            >
              Delete
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={submit}
              disabled={isLoading}
              className={`h-9 px-3 w-15 text-sm rounded-xl flex items-center justify-center bg-(--primary) transition duration-200 hover:brightness-115 ${
                isLoading ? "cursor-default" : "cursor-pointer"
              }`}
            >
              {isLoading ? <Spin /> : "Save"}
            </button>
            <button
              onClick={onClose}
              className="text-sm h-9 px-3 2-15 rounded-xl bg-(--bg-tertiary) cursor-pointer transition duration-200 hover:brightness-115"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
