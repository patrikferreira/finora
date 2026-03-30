import { useTranslation } from "react-i18next";
import { Expense, Income } from "../AppTypes";
import { useContext } from "react";
import AppContext from "../AppContext";

type Props = {
  incomes?: Income[];
  expenses?: Expense[];
  className?: string;
};

export default function BalanceOverview({
  incomes,
  expenses,
  className,
}: Props) {
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

  const filteredIncomes =
    billingCycle === "totaly"
      ? incomes ?? []
      : incomes?.filter((i) => i.cycle === billingCycle) ?? [];

  const filteredExpenses =
    billingCycle === "totaly"
      ? expenses ?? []
      : expenses?.filter((e) => e.cycle === billingCycle) ?? [];

  const totalIncome =
    billingCycle === "totaly"
      ? filteredIncomes.reduce((sum, i) => {
          const amount = i.amount ?? 0;
          return sum + (i.cycle === "monthly" ? amount * 12 : amount);
        }, 0)
      : filteredIncomes.reduce((sum, i) => sum + (i.amount ?? 0), 0);

  const totalExpense =
    billingCycle === "totaly"
      ? filteredExpenses.reduce((sum, e) => {
          const amount = e.amount ?? 0;
          return sum + (e.cycle === "monthly" ? amount * 12 : amount);
        }, 0)
      : filteredExpenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);

  const balance = totalIncome - totalExpense;
  const percentage = totalIncome === 0 ? 0 : (balance / totalIncome) * 100;
  const isPositive = balance >= 0;

  return (
    <div
      className={`flex flex-col flex-1 justify-between gap-6 p-6 rounded-2xl border border-(--border) bg-(--bg-secondary) shadow hover:shadow-xl transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs opacity-30 tracking-widest uppercase">
            {t("Total balance")}
          </p>
          <p className="text-2xl font-semibold tracking-tight">
            {balance < 0 ? "-" : ""}
            {formatAmount(Math.abs(balance))}
          </p>
        </div>

        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            color: isPositive ? "#4CCE7A" : "#F87171",
            backgroundColor: isPositive ? "#4CCE7A18" : "#F8717118",
          }}
        >
          {isPositive ? "+" : "-"}
          {Math.abs(percentage).toFixed(1)}%
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs opacity-30">{t("Incomes")}</span>
          <span className="text-sm font-medium" style={{ color: "#4CCE7A" }}>
            {formatAmount(totalIncome)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 items-end">
          <span className="text-xs opacity-30">{t("Expenses")}</span>
          <span className="text-sm font-medium" style={{ color: "#F87171" }}>
            {formatAmount(totalExpense)}
          </span>
        </div>
      </div>
    </div>
  );
}
