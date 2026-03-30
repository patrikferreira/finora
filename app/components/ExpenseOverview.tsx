import { useTranslation } from "react-i18next";
import { Expense } from "../AppTypes";
import { useContext } from "react";
import AppContext from "../AppContext";

type Props = {
  data?: Expense[];
  className?: string;
};

export default function ExpenseOverview({ data, className }: Props) {
  const { t } = useTranslation();
  const context = useContext(AppContext);

  if (!context) throw new Error("AppContext is not provided");

  const { user, billingCycle } = context;

  function formatAmount(amount: number | null | undefined) {
    const value = amount ?? 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: user?.currency || "USD",
      minimumFractionDigits: 0,
    }).format(value);
  }

  const filteredData =
    billingCycle === "totaly"
      ? data ?? []
      : data?.filter((e) => e.cycle === billingCycle) ?? [];

  const total =
    billingCycle === "totaly"
      ? filteredData.reduce((sum, e) => {
          const amount = e.amount ?? 0;
          return sum + (e.cycle === "monthly" ? amount * 12 : amount);
        }, 0)
      : filteredData.reduce((sum, e) => sum + (e.amount ?? 0), 0);

  const count = filteredData.length;

  const topExpense = filteredData.reduce(
    (top, e) => (!top || (e.amount ?? 0) > (top.amount ?? 0) ? e : top),
    null as Expense | null
  );

  const cycleLabel =
    billingCycle === "monthly"
      ? t("monthly")
      : billingCycle === "yearly"
      ? t("yearly")
      : t("totaly");

  return (
    <div
      className={`flex flex-col flex-1 justify-between gap-6 p-6 rounded-2xl border border-(--border) bg-(--bg-secondary) shadow hover:shadow-xl transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs opacity-30 tracking-widest uppercase">
            {t("Total expenses")}
          </p>
          <p className="text-2xl font-semibold tracking-tight">
            {formatAmount(total)}
          </p>
        </div>

        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ color: "#F87171", backgroundColor: "#F8717118" }}
        >
          {cycleLabel}
        </span>
      </div>

      {count > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs opacity-30">{t("expenses")}</span>
            <span className="text-sm font-medium">
              {count} {count === 1 ? t("entry") : t("expenses")}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-xs opacity-30">{t("Top expense")}</span>
            <span className="text-sm font-medium truncate max-w-[120px]">
              {(topExpense && topExpense.description) || "other"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
