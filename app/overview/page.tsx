"use client";
import { useCallback, useContext, useMemo } from "react";
import AppContext from "../AppContext";
import LoadingSpin from "../components/LoadingSpin";
import StatCard from "../components/StatCard";
import ExpenseChart from "../components/ExpenseChart";
import IncomeChart from "../components/IncomeChart";
import Button from "../components/Button";
import { billingCycle as BillingCycle } from "../AppTypes";
import {
  filterByView,
  formatCurrency,
  formatCurrencyCompact,
  sumAmounts,
  totalsByCategory,
} from "../utils/finance";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import {
  LuArrowDown,
  LuArrowUp,
  LuTrendingDown,
  LuTrendingUp,
  LuWallet,
} from "react-icons/lu";

const VIEWS: { value: BillingCycle; label: string; caption: string }[] = [
  { value: "monthly", label: "Monthly", caption: "Monthly entries, per month" },
  { value: "yearly", label: "Yearly", caption: "Yearly entries, per year" },
  { value: "totaly", label: "Total", caption: "All entries, per year" },
];

export default function Overview() {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext is not provided");
  }

  const {
    user,
    initialFetching,
    localExpenses,
    localIncomes,
    billingCycle,
    setBillingCycle,
    setIncomeDetail,
    setExpenseDetail,
  } = context;

  const currency = user?.currency || "USD";
  const formatAmount = useCallback(
    (amount: number) => formatCurrency(amount, currency),
    [currency],
  );
  const formatCompact = useCallback(
    (amount: number) => formatCurrencyCompact(amount, currency),
    [currency],
  );

  const summary = useMemo(() => {
    const incomes = filterByView(localIncomes, billingCycle);
    const expenses = filterByView(localExpenses, billingCycle);
    const totalIncome = sumAmounts(incomes, billingCycle);
    const totalExpense = sumAmounts(expenses, billingCycle);

    return {
      incomeCount: incomes.length,
      expenseCount: expenses.length,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeCategories: totalsByCategory(incomes, billingCycle),
      expenseCategories: totalsByCategory(expenses, billingCycle),
    };
  }, [localIncomes, localExpenses, billingCycle]);

  if (initialFetching)
    return (
      <div className="flex justify-center items-center h-svh w-full">
        <LoadingSpin className="" />
      </div>
    );

  if (!user) return;

  const {
    incomeCount,
    expenseCount,
    totalIncome,
    totalExpense,
    balance,
    incomeCategories,
    expenseCategories,
  } = summary;

  const countLabel = (count: number) =>
    `${count} ${t(count === 1 ? "entry" : "entries").toLowerCase()}`;

  const view = VIEWS.find((v) => v.value === billingCycle) ?? VIEWS[0];

  const incomeEmptyText =
    localIncomes.length === 0 ? t("No incomes yet") : t("No data to display");
  const expenseEmptyText =
    localExpenses.length === 0 ? t("No expenses yet") : t("No data to display");

  return (
    <div className="min-h-svh lg:h-screen min-w-0 w-full p-4 md:p-6 flex flex-col gap-5 overflow-auto animate-fadeIn">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {t("overview")}
          </h1>
          <p className="text-sm text-(--muted)">{t(view.caption)}</p>
        </div>

        <div
          role="group"
          aria-label={t("Select the cycle")}
          className="inline-flex h-9 p-0.5 gap-0.5 rounded-xl border border-(--border) bg-(--bg-secondary)/90 shadow-sm backdrop-blur-sm"
        >
          {VIEWS.map((option) => {
            const active = option.value === billingCycle;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => setBillingCycle(option.value)}
                className={`h-full px-3 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 ${
                  active
                    ? "bg-(--primary) text-(--on-primary) shadow-(--shadow-button)"
                    : "text-(--muted) hover:text-(--foreground) hover:bg-(--bg-muted)"
                }`}
              >
                {t(option.label)}
              </button>
            );
          })}
        </div>
      </header>

      {/* KEY FIGURES */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 shrink-0">
        <StatCard
          label={t("Total balance")}
          value={formatAmount(balance)}
          icon={<LuWallet size={16} />}
          highlight
          className="col-span-2 lg:col-span-1"
        >
          {incomeCount === 0 && expenseCount === 0 ? (
            t("No data to display")
          ) : balance === 0 ? (
            t("Balanced")
          ) : (
            <span
              className={`inline-flex items-center gap-1 h-6 px-2 rounded-full font-semibold ${
                balance > 0
                  ? "bg-(--on-primary)/15 text-(--on-primary)"
                  : "bg-(--on-primary) text-(--danger-ink)"
              }`}
            >
              {balance > 0 ? (
                <LuTrendingUp size={14} aria-hidden />
              ) : (
                <LuTrendingDown size={14} aria-hidden />
              )}
              {balance > 0 ? t("Surplus") : t("Deficit")}
            </span>
          )}
        </StatCard>

        <StatCard
          label={t("Total incomes")}
          value={formatAmount(totalIncome)}
          icon={<LuArrowUp size={16} />}
          iconClassName="bg-(--primary-soft) text-(--primary)"
        >
          {countLabel(incomeCount)}
        </StatCard>

        <StatCard
          label={t("Total expenses")}
          value={formatAmount(totalExpense)}
          icon={<LuArrowDown size={16} />}
          iconClassName="bg-(--danger-soft) text-(--danger-ink)"
        >
          {countLabel(expenseCount)}
        </StatCard>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        <ExpenseChart
          items={expenseCategories}
          total={totalExpense}
          formatAmount={formatAmount}
          formatCompact={formatCompact}
          emptyText={expenseEmptyText}
          emptyAction={
            <Button
              action={() =>
                setExpenseDetail({
                  show: true,
                  newExpense: true,
                  currentExpense: null,
                })
              }
              text="Add expense"
              icon={<FiPlus size={16} />}
              variant="secondary"
            />
          }
          className="lg:col-span-2"
        />
        <IncomeChart
          items={incomeCategories}
          total={totalIncome}
          formatAmount={formatAmount}
          emptyText={incomeEmptyText}
          emptyAction={
            <Button
              action={() =>
                setIncomeDetail({
                  show: true,
                  newIncome: true,
                  currentIncome: null,
                })
              }
              text="Add income"
              icon={<FiPlus size={16} />}
              variant="secondary"
            />
          }
        />
      </div>
    </div>
  );
}
