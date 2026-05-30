import { useTranslation } from "react-i18next";
import { Income } from "../AppTypes";
import { useContext } from "react";
import AppContext from "../AppContext";
import { TbMoneybag } from "react-icons/tb";

type Props = {
  data?: Income[];
  className?: string;
};

export default function IncomeOverview({ data, className }: Props) {
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
      : (data?.filter((i) => i.cycle === billingCycle) ?? []);

  const total =
    billingCycle === "totaly"
      ? filteredData.reduce((sum, i) => {
          const amount = i.amount ?? 0;
          return sum + (i.cycle === "monthly" ? amount * 12 : amount);
        }, 0)
      : filteredData.reduce((sum, i) => sum + (i.amount ?? 0), 0);

  const count = filteredData.length;

  const topIncome = filteredData.reduce(
    (top, i) => (!top || (i.amount ?? 0) > (top.amount ?? 0) ? i : top),
    null as Income | null,
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
            <div className="h-7 w-7 rounded-lg bg-(--primary-soft) flex items-center justify-center text-(--primary)">
              <TbMoneybag size={14} />
            </div>
            <p className="text-xs text-(--muted) font-medium tracking-wide">
              {t("Total incomes")}
            </p>
          </div>
          <p className="text-2xl font-semibold tracking-tight tabular">
            {formatAmount(total)}
          </p>
        </div>

        <span
          className="text-[10px] font-medium px-2 py-1 rounded-md uppercase tracking-wider"
          style={{
            color: "#4CCE7A",
            backgroundColor: "rgba(76, 206, 122, 0.12)",
          }}
        >
          {cycleLabel}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-(--border)">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] text-(--muted) uppercase tracking-wider">
            {t("incomes")}
          </span>
          <span className="text-sm font-medium tabular">
            {count} {count === 1 ? t("entry") : t("incomes")}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 items-end">
          <span className="text-[11px] text-(--muted) uppercase tracking-wider">
            {t("Top entrie")}
          </span>
          <span className="text-sm font-medium truncate max-w-[120px]">
            {(topIncome && topIncome.description) || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
