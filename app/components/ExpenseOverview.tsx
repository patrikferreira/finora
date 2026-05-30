import { useTranslation } from "react-i18next";
import { Expense } from "../AppTypes";
import { useContext } from "react";
import AppContext from "../AppContext";
import { HiOutlineDownload } from "react-icons/hi";

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
      ? (data ?? [])
      : (data?.filter((e) => e.cycle === billingCycle) ?? []);

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
    null as Expense | null,
  );

  const cycleLabel =
    billingCycle === "monthly"
      ? t("monthly")
      : billingCycle === "yearly"
        ? t("yearly")
        : t("totaly");

  return (
    <div
      className={`flex flex-col flex-1 justify-between gap-6 p-5 rounded-2xl border border-(--border) bg-(--bg-secondary) hover:border-(--border-strong) transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div
              className="h-7 w-7 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(248, 113, 113, 0.12)",
                color: "#F87171",
              }}
            >
              <HiOutlineDownload size={14} />
            </div>
            <p className="text-xs text-(--muted) font-medium tracking-wide">
              {t("Total expenses")}
            </p>
          </div>
          <p className="text-2xl font-semibold tracking-tight tabular">
            {formatAmount(total)}
          </p>
        </div>

        <span
          className="text-[10px] font-medium px-2 py-1 rounded-md uppercase tracking-wider"
          style={{
            color: "#F87171",
            backgroundColor: "rgba(248, 113, 113, 0.12)",
          }}
        >
          {cycleLabel}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-(--border)">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-(--muted) uppercase tracking-wider">
            {t("expenses")}
          </span>
          <span className="text-sm font-medium tabular">
            {count} {count === 1 ? t("entry") : t("expenses")}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 items-end">
          <span className="text-[11px] text-(--muted) uppercase tracking-wider">
            {t("Top expense")}
          </span>
          <span className="text-sm font-medium truncate max-w-[120px]">
            {(topExpense && topExpense.description) || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
