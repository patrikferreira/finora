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
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const { billingCycle } = context;

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

  const labels = sortedCategories.map(
    (cat) => cat.charAt(0).toUpperCase() + cat.slice(1)
  );

  const primaryHex = "#3cc087";
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

  const chartData = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: sortedAmounts,
        backgroundColor: backgroundColors,
        borderRadius: 8,
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
              return `$${value.toFixed(2)}`;
            },
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#303030",
        },
        ticks: {
          color: "rgba(255,255,255,0.5)",
          callback: (value: number | string) => `$${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255,255,255,0.5)",
        },
      },
    },
  };

  return (
    <div
      className={`flex flex-col gap-4 p-4 border border-(--border-primary) bg-(--bg-secondary) rounded-xl shaodw-xl ${className}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-md lg:text-lg">Expense overview</h2>
          <p className="text-sm opacity-50">
            {billingCycle === "monthly"
              ? "Monthly"
              : billingCycle === "yearly"
              ? "Yearly"
              : "Total yearly"}{" "}
            spending by category
          </p>
        </div>
        {!data || data.length === 0 ? null : (
          <div className="flex flex-col items-end">
            <h2 className="text-md lg:text-lg">{`$ ${totalExpense.toFixed(
              2
            )}`}</h2>
            <p className="text-sm opacity-50">
              Total {billingCycle === "totaly" ? "yearly" : billingCycle}
            </p>
          </div>
        )}
      </div>

      {/* CHART */}
      {!data || data.length === 0 ? (
        <div className="flex items-center justify-center flex-1 text-sm opacity-50">
          No data yet
        </div>
      ) : (
        <div className="flex-1 flex min-h-[200px] max-h-[300px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
