import { useContext } from "react";
import { Expense, Income } from "../AppTypes";
import AppContext from "../AppContext";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  incomes?: Income[];
  expenses?: Expense[];
  className?: string;
};

export default function TotalBalance({ incomes, expenses, className }: Props) {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

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

  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  const secondaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--secondary")
    .trim();

  const chartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount",
        data: [totalIncome, totalExpense],
        backgroundColor: [secondaryColor, primaryColor],
        borderWidth: 0,
        spacing: 4,
        borderRadius: 16,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "75%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"doughnut">) =>
            `${context.label}: $${context.parsed.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div
      className={`flex flex-col gap-4 p-4 border border-(--border) bg-(--bg-secondary) shadow hover:shadow-xl transition-all duration-200 min-h-60 rounded-2xl ${className}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-md lg:text-lg font-medium">{t("Balance overview")}</h2>
          <p className="text-sm opacity-50">
            {billingCycle === "monthly"
              ? t("Monthly balance summary")
              : billingCycle === "yearly"
              ? t("Yearly balance summary")
              : t("Total balance summary")}
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
        <div className="flex-1 flex gap-2 items-center justify-around">
          <div className="w-full max-w-[180px] lg:max-w-[180px] relative z-0">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -z-10">
              <p className="text-xs opacity-50">{t("Total balance")}</p>
              <p className="text-lg font-bold">
                {balance < 0 ? "-" : ""}{formatAmount(Math.abs(balance))}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-col justify-center gap-6">
            <div className="flex flex-col items-center">
              <p className="font-semibold ">{formatAmount(totalIncome)}</p>
              <span className="text-xs opacity-50">{t("Total incomes")}</span>
            </div>
            <div className="flex items-center">
              {balance >= 0 ? (
                <IoIosArrowUp size={24} />
              ) : (
                <IoIosArrowDown size={24} style={{ color: primaryColor }} />
              )}
            </div>
            <div className="flex flex-col items-center">
              <p className="font-semibold">{formatAmount(totalExpense)}</p>
              <span className="text-xs opacity-50">{t("Total expenses")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
