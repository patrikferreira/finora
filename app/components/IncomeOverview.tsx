import { useTranslation } from "react-i18next";
import { Income } from "../AppTypes";
import { useContext } from "react";
import AppContext from "../AppContext";

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
      ? data ?? []
      : data?.filter((i) => i.cycle === billingCycle) ?? [];

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
    null as Income | null
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
            {t("Total incomes")}
          </p>
          <p className="text-2xl font-semibold tracking-tight">
            {formatAmount(total)}
          </p>
        </div>

        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ color: "#4CCE7A", backgroundColor: "#4CCE7A18" }}
        >
          {cycleLabel}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs opacity-30">{t("incomes")}</span>
          <span className="text-sm font-medium">
            {count} {count === 1 ? t("entry") : t("incomes")}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 items-end">
          <span className="text-xs opacity-30">{t("Top entrie")}</span>
          <span className="text-sm font-medium truncate max-w-[120px]">
            {topIncome ? topIncome.description || "other" : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
