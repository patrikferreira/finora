import { useContext } from "react";
import { Expense, Income } from "../AppTypes";
import AppContext from "../AppContext";

type Props = {
  incomes?: Income[];
  expenses?: Expense[];
  className?: string;
};

export default function TotalBalance({ incomes, expenses, className }: Props) {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { billingCycle } = context;

  const filteredIncomes =
    billingCycle === "totaly"
      ? incomes ?? []
      : incomes?.filter((income) => income.cycle === billingCycle) ?? [];

  const filteredExpenses =
    billingCycle === "totaly"
      ? expenses ?? []
      : expenses?.filter((expense) => expense.cycle === billingCycle) ?? [];

  const totalIncome =
    billingCycle === "totaly"
      ? filteredIncomes?.reduce((sum, income) => {
          const amount = income.amount ?? 0;
          return sum + (income.cycle === "monthly" ? amount * 12 : amount);
        }, 0) || 0
      : filteredIncomes?.reduce(
          (sum, income) => sum + (income.amount ?? 0),
          0
        ) || 0;

  const totalExpense =
    billingCycle === "totaly"
      ? filteredExpenses?.reduce((sum, expense) => {
          const amount = expense.amount ?? 0;
          return sum + (expense.cycle === "monthly" ? amount * 12 : amount);
        }, 0) || 0
      : filteredExpenses?.reduce(
          (sum, expense) => sum + (expense.amount ?? 0),
          0
        ) || 0;

  const balance = totalIncome - totalExpense;
  const balancePercentage = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (balancePercentage / 100) * circumference;
  const strokeColor = balance >= 0 ? "#3cc087" : "#ef4444";

  return (
    <div
      className={`flex flex-col gap-4 p-4 border border-(--border-primary) bg-(--bg-secondary) rounded-xl shadow-xl ${className}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-md lg:text-lg font-medium">Balance overview</h2>
          <p className="text-sm opacity-50">
            {billingCycle === "monthly"
              ? "Monthly"
              : billingCycle === "yearly"
              ? "Yearly"
              : "Total yearly"}{" "}
            summary
          </p>
        </div>
      </div>

      {/* CHART */}
      {incomes &&
      expenses &&
      filteredIncomes.length === 0 &&
      filteredExpenses.length === 0 ? (
        <div className="flex items-center justify-center flex-1 text-sm opacity-50">
          No data yet
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4">
          <div className="relative flex items-center justify-center flex-1">
            <svg className="transform -rotate-90" width="180" height="180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="#ffffff08"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-in-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center gap-0.5">
              <p className="text-[10px] uppercase tracking-widest opacity-30">
                Balance
              </p>
              <h3
                className="text-2xl font-bold tabular-nums transition-colors duration-300"
                style={{ color: balance >= 0 ? "#3cc087" : "#ef4444" }}
              >
                ${Math.abs(balance).toFixed(2)}
              </h3>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: balance >= 0 ? "#3cc08718" : "#ef444418",
                  color: balance >= 0 ? "#3cc087" : "#ef4444",
                }}
              >
                {balancePercentage.toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1 w-full">
            <div className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-[#3cc087]/5 hover:border-[#3cc087]/20 transition-all duration-300">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#3cc087]/10 shrink-0">
                <svg
                  className="w-4 h-4 text-[#3cc087]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <p className="text-[11px] uppercase tracking-widest opacity-30">
                  Income
                </p>
                <h4 className="text-lg font-semibold tabular-nums text-[#3cc087]">
                  ${totalIncome.toFixed(2)}
                </h4>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-[#ef4444]/5 hover:border-[#ef4444]/20 transition-all duration-300">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#ef4444]/10 shrink-0">
                <svg
                  className="w-4 h-4 text-[#ef4444]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <p className="text-[11px] uppercase tracking-widest opacity-30">
                  Expenses
                </p>
                <h4 className="text-lg font-semibold tabular-nums text-[#ef4444]">
                  ${totalExpense.toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
