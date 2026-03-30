import { Income } from "../AppTypes";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { TooltipItem } from "chart.js";
import { useContext } from "react";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  data?: Income[];
  className?: string;
};

export default function IncomeChart({ data, className }: Props) {
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
      : data?.filter((income) => income.cycle === billingCycle) ?? [];

  const totalIncome =
    billingCycle === "totaly"
      ? filteredData.reduce((sum, income) => {
          const amount = income.amount ?? 0;
          return sum + (income.cycle === "monthly" ? amount * 12 : amount);
        }, 0)
      : filteredData.reduce((sum, income) => sum + (income.amount ?? 0), 0);

  const allCategories = [
    "salary",
    "freelancer",
    "investment",
    "business",
    "benefit",
    "other",
  ];

  const categoryColors: Record<string, string> = {
    salary: "#4CCE7A",
    freelancer: "#F4923A",
    investment: "#F5C842",
    business: "#F87171",
    benefit: "#42C8E0",
    other: "#94A3B8",
  };

  const categoryTotals = filteredData.reduce((acc, income) => {
    const category = income.category || "other";
    const amount = income.amount ?? 0;

    const adjustedAmount =
      billingCycle === "totaly" && income.cycle === "monthly"
        ? amount * 12
        : amount;

    acc[category] = (acc[category] || 0) + adjustedAmount;
    return acc;
  }, {} as Record<string, number>);

  const realValues = allCategories.map((cat) => categoryTotals?.[cat] || 0);

  const chartValues = realValues.map((val) => (val === 0 ? 0.0001 : val));

  const labels = allCategories.map((cat) => t(cat));

  const backgroundColors = allCategories.map((cat, i) => {
    const color = categoryColors[cat] || "#cecece";
    return realValues[i] === 0 ? color + "1A" : color;
  });

  const doughnutData = {
    labels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: backgroundColors,
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#212121",
        padding: 12,
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const index = context.dataIndex;
            const realValue = realValues[index];
            return `${context.label}: ${formatAmount(realValue)}`;
          },
        },
      },
    },
  };

  return (
    <div
      className={`flex flex-col gap-4 p-4 z-0 border border-(--border) bg-(--bg-secondary) shadow hover:shadow-xl transition-all duration-200 min-h-90 rounded-2xl ${className}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h2 className="text-md lg:text-lg">{t("Income overview")}</h2>
          <p className="text-sm opacity-50">{t("Incomes by category")}</p>
        </div>

        {!data || data.length === 0 ? null : (
          <div className="flex flex-col items-end">
            <h2 className="text-md lg:text-lg">{formatAmount(totalIncome)}</h2>
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
        <div className="flex items-center flex-1 justify-center text-sm opacity-50">
          {t("No incomes yet")}
        </div>
      ) : (
        <div className="flex flex-col gap-4 justify-between flex-1 min-h-[260px]">
          <div className="flex-1 flex items-center justify-center ">
            <div className="w-full flex justify-center items-center h-full">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            {labels.map((label, i) => (
              <div
                key={label}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        categoryColors[allCategories[i]] || "#cecece",
                    }}
                  />
                  <span className="text-sm opacity-80">{label}</span>
                </div>
                <span className="text-sm font-medium">
                  {formatAmount(realValues[i])}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
