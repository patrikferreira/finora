import { ReactNode, useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import type { ChartOptions, TooltipItem } from "chart.js";
import { useTranslation } from "react-i18next";
import { CategoryTotal } from "../utils/finance";
import { readChartTheme, tooltipStyle } from "../utils/chartTheme";
import DashboardCard, { DashboardCardEmpty } from "./DashboardCard";

ChartJS.register(ArcElement, Tooltip);

const CATEGORY_ORDER = [
  "salary",
  "freelancer",
  "investment",
  "business",
  "benefit",
  "other",
];

function colorIndex(category: string) {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length - 1 : index;
}

type Props = {
  items: CategoryTotal[];
  total: number;
  formatAmount: (amount: number) => string;
  emptyText: string;
  emptyAction?: ReactNode;
  className?: string;
};

export default function IncomeChart({
  items,
  total,
  formatAmount,
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
          backgroundColor: items.map(
            (item) => theme.palette[colorIndex(item.category)],
          ),
          borderColor: theme.surface,
          borderWidth: 3,
          borderRadius: 4,
          hoverOffset: 4,
        },
      ],
    }),
    [items, theme, t],
  );

  const options = useMemo<ChartOptions<"doughnut">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      layout: { padding: 4 },
      font: { family: theme.fontFamily },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle(theme),
          callbacks: {
            label: (context: TooltipItem<"doughnut">) => {
              const value = context.parsed;
              const share = total > 0 ? (value / total) * 100 : 0;
              return `${formatAmount(value)} · ${share.toFixed(1)}%`;
            },
          },
        },
      },
    }),
    [theme, total, formatAmount],
  );

  return (
    <DashboardCard title={t("Incomes by category")} className={className}>
      {items.length > 0 ? (
        <div className="flex flex-col gap-5 flex-1">
          <div className="relative h-52 shrink-0">
            <div className="absolute inset-0">
              <Doughnut data={data} options={options} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-(--muted)">{t("Total")}</span>
              <span className="text-lg font-bold tracking-tight tabular-nums">
                {formatAmount(total)}
              </span>
            </div>
          </div>

          <ul className="flex flex-col gap-2.5">
            {items.map((item) => {
              const share = total > 0 ? (item.amount / total) * 100 : 0;

              return (
                <li
                  key={item.category}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background: `var(--chart-${colorIndex(item.category) + 1})`,
                      }}
                    />
                    <span className="truncate">{t(item.category)}</span>
                  </span>
                  <span className="flex items-baseline gap-2 tabular-nums whitespace-nowrap">
                    <span className="font-medium">
                      {formatAmount(item.amount)}
                    </span>
                    <span className="w-11 text-right text-xs text-(--muted)">
                      {share.toFixed(1)}%
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <DashboardCardEmpty text={emptyText} action={emptyAction} />
      )}
    </DashboardCard>
  );
}
