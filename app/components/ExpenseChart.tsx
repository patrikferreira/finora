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
import type { TooltipItem, ChartOptions } from "chart.js";
import { useContext, useMemo } from "react";
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
      maximumFractionDigits: 0,
    }).format(value);
  }

  const filteredData = useMemo(
    () =>
      billingCycle === "totaly"
        ? data ?? []
        : data?.filter((expense) => expense.cycle === billingCycle) ?? [],
    [data, billingCycle]
  );

  const totalExpense = useMemo(() => {
    if (billingCycle === "totaly") {
      return (
        filteredData?.reduce((sum, expense) => {
          const amount = expense.amount ?? 0;
          return sum + (expense.cycle === "monthly" ? amount * 12 : amount);
        }, 0) || 0
      );
    }
    return (
      filteredData?.reduce((sum, expense) => sum + (expense.amount ?? 0), 0) ||
      0
    );
  }, [filteredData, billingCycle]);

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

  const categoryTotals = useMemo(() => {
    return filteredData?.reduce((acc, expense) => {
      const category = expense.category || "other";
      const amount = expense.amount ?? 0;
      const adjustedAmount =
        billingCycle === "totaly" && expense.cycle === "monthly"
          ? amount * 12
          : amount;
      acc[category] = (acc[category] || 0) + adjustedAmount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);
  }, [filteredData, billingCycle]);

  const sortedAmounts = allCategories.map((cat) => categoryTotals?.[cat] || 0);
  const maxAmount = Math.max(...sortedAmounts);

  const primaryColor = "#36bd81";

  const getBarColor = (amount: number) => {
    if (amount === 0) return "rgba(203, 213, 225, 0.08)";

    const intensity = amount / maxAmount;
    const opacity = 0.3 + intensity * 0.5;

    if (amount === maxAmount) {
      return primaryColor;
    }

    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const chartData = {
    labels: allCategories.map((cat) => t(`${cat}`)),
    datasets: [
      {
        label: t("Expenses"),
        data: sortedAmounts,
        backgroundColor: sortedAmounts.map((amt) => getBarColor(amt)),
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        padding: 12,
        titleColor: "#f3f4f6",
        bodyColor: "#d1d5db",
        borderColor: `rgba(54, 189, 129, 0.3)`,
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const value = context.parsed.y;
            return `${formatAmount(value)}`;
          },
          title: (items: TooltipItem<"bar">[]) => {
            return items[0].label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.ceil(maxAmount / 100) * 100,
        border: {
          display: false,
        },
        grid: {
          color: "rgba(203, 213, 225, 0.08)",
        },
        ticks: {
          stepSize: Math.ceil(maxAmount / 5) || 1,
          callback: (value) => {
            const numValue =
              typeof value === "number" ? value : parseFloat(value);
            if (numValue === 0) return "";
            return formatAmount(numValue);
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
  };

  const hasData = data && data.length > 0;

  return (
    <div
      className={`flex flex-col justify-between gap-4 p-4 z-0 border border-(--border) bg-(--bg-secondary) shadow hover:shadow-xl transition-all duration-300 min-h-60 rounded-2xl ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-md lg:text-lg">{t("Expense overview")}</h2>
          <p className="text-sm opacity-50">{t("Expenses by category")}</p>
        </div>
        {hasData && (
          <div className="flex flex-col items-end">
            <h2 className="text-md lg:text-lg">{formatAmount(totalExpense)}</h2>
            <p className="text-sm opacity-50">
              {billingCycle === "monthly"
                ? t("monthly")
                : billingCycle === "yearly"
                ? t("yearly")
                : t("totaly")}
            </p>
          </div>
        )}
      </div>

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