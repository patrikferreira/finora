import { ReactNode, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { ChartOptions, TooltipItem } from "chart.js";
import { useTranslation } from "react-i18next";
import { CategoryTotal } from "../utils/finance";
import { readChartTheme, tooltipStyle, withAlpha } from "../utils/chartTheme";
import DashboardCard, { DashboardCardEmpty } from "./DashboardCard";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

type Props = {
  items: CategoryTotal[];
  total: number;
  formatAmount: (amount: number) => string;
  formatCompact: (amount: number) => string;
  emptyText: string;
  emptyAction?: ReactNode;
  className?: string;
};

export default function ExpenseChart({
  items,
  total,
  formatAmount,
  formatCompact,
  emptyText,
  emptyAction,
  className,
}: Props) {
  const { t } = useTranslation();
  const theme = useMemo(() => readChartTheme(), []);

  const data = useMemo(
    () => ({
      labels: items.map((item) => t(item.category)),
      datasets: [
        {
          data: items.map((item) => item.amount),
          backgroundColor: theme.primary,
          hoverBackgroundColor: withAlpha(theme.primary, 0.85),
          borderRadius: 6,
          maxBarThickness: 48,
        },
      ],
    }),
    [items, theme, t],
  );

  const options = useMemo<ChartOptions<"bar">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      font: { family: theme.fontFamily },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle(theme),
          displayColors: false,
          callbacks: {
            label: (context: TooltipItem<"bar">) => {
              const value = context.parsed.y ?? 0;
              const share = total > 0 ? (value / total) * 100 : 0;
              return `${formatAmount(value)} · ${share.toFixed(1)}%`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: theme.border },
          ticks: {
            color: theme.muted,
            font: { size: 11 },
            maxTicksLimit: 5,
            padding: 8,
            callback: (value) => formatCompact(Number(value)),
          },
        },
        x: {
          border: { display: false },
          grid: { display: false },
          ticks: {
            color: theme.muted,
            font: { size: 12 },
            maxRotation: 40,
          },
        },
      },
    }),
    [theme, total, formatAmount, formatCompact],
  );

  return (
    <DashboardCard
      title={t("Expenses by category")}
      aside={
        items.length > 0 && (
          <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
            {formatAmount(total)}
          </span>
        )
      }
      className={className}
    >
      {items.length > 0 ? (
        <div className="relative flex-1 min-h-64">
          <div className="absolute inset-0">
            <Bar data={data} options={options} />
          </div>
        </div>
      ) : (
        <DashboardCardEmpty text={emptyText} action={emptyAction} />
      )}
    </DashboardCard>
  );
}
