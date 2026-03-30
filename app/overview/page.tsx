"use client";
import { useContext } from "react";
import AppContext from "../AppContext";
import LoadingSpin from "../components/LoadingSpin";
import ExpenseChart from "../components/ExpenseChart";
import Select from "../components/Select";
import { billingCycle } from "../AppTypes";
import { useTranslation } from "react-i18next";
import IncomeOverview from "../components/IncomeOverview";
import ExpenseOverview from "../components/ExpenseOverview";
import BalanceOverview from "../components/BalanceOverview";
import IncomeChart from "../components/IncomeChart";

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
  } = context;

  if (initialFetching)
    return (
      <div className="flex justify-center items-center h-svh w-full">
        <LoadingSpin className="" />
      </div>
    );

  if (!user) return;

  return (
    <div
      className={`min-h-svh lg:h-screen p-4 flex flex-col gap-4 overflow-auto w-full animate-fadeIn`}
    >
      {/* TITLE VIEW */}
      <div className="flex items-center justify-between">
        <div className="hidden md:flex flex-col">
          <h1 className="text-2xl font-semibold">{t("overview")}</h1>
          <span className="opacity-50 text-sm">{t("summary overview")}</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden lg:flex opacity-50 text-sm">
            {t("Select the cycle")}
          </p>
          <Select
            value={billingCycle}
            onChange={(value) => setBillingCycle(value as billingCycle)}
            options={[
              { value: "monthly", label: t("Monthly") },
              { value: "yearly", label: t("Yearly") },
              { value: "totaly", label: t("Totaly") },
            ]}
            btnClassName="!h-10 !w-30"
          />
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="grid gap-4 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <IncomeOverview data={localIncomes} />
          <ExpenseOverview data={localExpenses} />
          <BalanceOverview incomes={localIncomes} expenses={localExpenses} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="min-h-[300px] lg:col-span-2">
            <ExpenseChart
              data={localExpenses}
              className="h-full w-full max-h-[500px]"
            />
          </div>
          <div className="min-h-[300px] lg:col-span-1">
            <IncomeChart
              data={localIncomes}
              className="h-full w-full max-h-[500px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
