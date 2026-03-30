import { Expense, ExpenseCategory } from "../AppTypes";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { TooltipItem } from "chart.js";
import { useContext } from "react";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  data?: Expense[];
  className?: string;
};

export default function ExpenseChart({ data, className }: Props) {
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

  const filteredData =
    billingCycle === "totaly"
      ? data ?? []
      : data?.filter((expense) => expense.cycle === billingCycle) ?? [];

  const totalExpense =
    billingCycle === "totaly"
      ? filteredData?.reduce((sum, expense) => {
          const amount = expense.amount ?? 0;
          return sum + (expense.cycle === "monthly" ? amount * 12 : amount);
        }, 0) || 0
      : filteredData?.reduce(
          (sum, expense) => sum + (expense.amount ?? 0),
          0
        ) || 0;

  const allCategories: ExpenseCategory[] = [
    "education",
    "entertainment",
    "food",
    "health",
    "house",
    "investment",
    "other",
    "saving",
    "subscription",
    "transport",
  ];

  const categoryTotals = filteredData?.reduce((acc, expense) => {
    const category = expense.category || "other";
    const amount = expense.amount ?? 0;
    const adjustedAmount =
      billingCycle === "totaly" && expense.cycle === "monthly"
        ? amount * 12
        : amount;
    acc[category] = (acc[category] || 0) + adjustedAmount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const sortedCategories = allCategories;
  const sortedAmounts = sortedCategories.map(
    (cat) => categoryTotals?.[cat] || 0
  );

  const labels = sortedCategories.map((cat) =>
    t(`${cat}`)
  );

  const primaryHex = "#cecece";
  const hexToRgba = (hex: string, alpha = 1) => {
    const cleaned = hex.replace("#", "");
    const bigint = parseInt(
      cleaned.length === 3
        ? cleaned
            .split("")
            .map((c) => c + c)
            .join("")
        : cleaned,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const primary40 = hexToRgba(primaryHex, 0.4);
  const maxAmount = Math.max(...sortedAmounts);
  const backgroundColors = sortedAmounts.map((amt) =>
    amt > 0 && amt === maxAmount ? primaryHex : primary40
  );

  const foregroundColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim();
  const foregroundWithOpacity = hexToRgba(foregroundColor, 0.5);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: sortedAmounts,
        backgroundColor: backgroundColors,
        borderRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        tooltip: {
          backgroundColor: "#212121",
          padding: 12,
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          callbacks: {
            label: (context: TooltipItem<"bar">) => {
              const parsed = context.parsed;
              const value =
                typeof parsed === "number"
                  ? parsed
                  : parsed && typeof parsed === "object"
                  ? parsed.y ?? 0
                  : 0;
              return `${value.toFixed(2)}`;
            },
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: getComputedStyle(document.documentElement)
            .getPropertyValue("--border")
            .trim(),
        },
        ticks: {
          color: foregroundWithOpacity,
          callback: (value: number | string) =>
            `${formatAmount(value as number)}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: foregroundWithOpacity,
        },
      },
    },
  };

  return (
    <div
      className={`flex flex-col justify-between gap-4 p-4 z-0 border border-(--border) bg-(--bg-secondary) shadow hover:shadow-xl transition-all duration-200 min-h-60 rounded-2xl ${className}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-md lg:text-lg">{t("Expense overview")}</h2>
          <p className="text-sm opacity-50">
            {t("Expenses by category")}
          </p>
        </div>
        {!data || data.length === 0 ? null : (
          <div className="flex flex-col items-end">
            <h2 className="text-md lg:text-lg">{`${formatAmount(totalExpense)}`}</h2>
            <p className="text-sm opacity-50">
              {billingCycle === "monthly" ? t("monthly") : billingCycle === "yearly" ? t("yearly") : t("totaly")}
            </p>
          </div>
        )}
      </div>

      {/* CHART */}
      {!data || data.length === 0 ? (
        <div className="flex items-center justify-center flex-1 text-sm opacity-50">
          {t("No expenses yet")}
        </div>
      ) : (
        <div className="flex-1 flex min-h-[200px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
