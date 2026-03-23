"use client";
import { createContext, ReactNode, use, useEffect, useState } from "react";
import {
  AccountSettingsDetail,
  billingCycle,
  ConfirmAction,
  Expense,
  ExpenseDetail,
  Income,
  IncomeDetail,
  Language,
  ProfileDetail,
  Toast,
  UserAuthenticated,
} from "./AppTypes";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "./AppServices";
import { getIncomes, getExpenses } from "./AppServices";
import { Languages } from "next/dist/lib/metadata/types/alternative-urls-types";
import i18n from "./i18n";

type AppContextType = {
  toast: Toast;
  setToast: (toast: Toast) => void;
  initialFetching: boolean;
  setInitialFetching: (value: boolean) => void;
  user: UserAuthenticated | undefined;
  setUser: (user: UserAuthenticated | undefined) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen?: (value: boolean) => void;
  localIncomes: Income[];
  setLocalIncomes: (incomes: Income[]) => void;
  localExpenses: Expense[];
  setLocalExpenses: (expenses: Expense[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  confirmAction: ConfirmAction;
  setConfirmAction: (action: ConfirmAction) => void;
  incomeDetail: IncomeDetail;
  setIncomeDetail: (IncomeDetail: IncomeDetail) => void;
  expenseDetail: ExpenseDetail;
  setExpenseDetail: (expenseDetail: ExpenseDetail) => void;
  refreshData: boolean;
  setRefreshData: (value: boolean) => void;
  billingCycle: billingCycle;
  setBillingCycle: (cycle: billingCycle) => void;
  trialPeriodAlert?: boolean;
  setTrialPeriodAlert?: (value: boolean) => void;
  profileDetail: ProfileDetail;
  setProfileDetail?: (ProfileDetail: ProfileDetail) => void;
  accountSettingsDetail: AccountSettingsDetail;
  setAccountSettingsDetail?: (AccountSettingsDetail: ProfileDetail) => void;
  refreshUser?: (user: UserAuthenticated) => void;
  language: Language;
  setLanguage: (language: Language) => void;
};

const AppContext = createContext<AppContextType>({
  toast: { message: "", status: "info", show: false },
  setToast: () => {},
  user: undefined,
  setUser: () => {},
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  localIncomes: [],
  setLocalIncomes: () => {},
  localExpenses: [],
  setLocalExpenses: () => {},
  initialFetching: false,
  setInitialFetching: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  confirmAction: {
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  },
  setConfirmAction: () => {},
  incomeDetail: {
    show: false,
    newIncome: true,
    currentIncome: null,
  },
  setIncomeDetail: () => {},
  expenseDetail: {
    show: false,
    newExpense: true,
    currentExpense: null,
  },
  setExpenseDetail: () => {},
  refreshData: false,
  setRefreshData: () => {},
  billingCycle: "monthly",
  setBillingCycle: () => {},
  profileDetail: { show: false },
  setProfileDetail: () => {},
  accountSettingsDetail: { show: false },
  setAccountSettingsDetail: () => {},
  refreshUser: () => {},
  language: "en",
  setLanguage: () => {},
});

export default AppContext;

export function AppContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [toast, setToast] = useState<Toast>({
    message: "",
    status: "info",
    show: false,
  });
  const [initialFetching, setInitialFetching] = useState<boolean>(true);
  const [user, setUser] = useState<UserAuthenticated | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [localIncomes, setLocalIncomes] = useState<Income[]>([]);
  const [localExpenses, setLocalExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  const [incomeDetail, setIncomeDetail] = useState<IncomeDetail>({
    show: false,
    newIncome: true,
    currentIncome: null,
  });
  const [expenseDetail, setExpenseDetail] = useState<ExpenseDetail>({
    show: false,
    newExpense: true,
    currentExpense: null,
  });
  const [refreshData, setRefreshData] = useState<boolean>(false);
  const [billingCycle, setBillingCycle] = useState<billingCycle>("monthly");
  const [trialPeriodAlert, setTrialPeriodAlert] = useState<boolean>(false);
  const [profileDetail, setProfileDetail] = useState<ProfileDetail>({
    show: false,
  });
  const [accountSettingsDetail, setAccountSettingsDetail] =
    useState<AccountSettingsDetail>({
      show: false,
    });

  const [language, setLanguage] = useState<Language>("en");

  function refreshUser(user: UserAuthenticated) {
    setUser(user);
    setLanguage(user.language as Language);
  }

  useEffect(() => {
    setInitialFetching(true);
    const fetchUser = async () => {
      try {
        const data = await getUserFromToken();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(undefined);
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(undefined);
      } finally {
        setInitialFetching(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setInitialFetching(true);
      try {
        const [incomesData, expensesData] = await Promise.all([
          getIncomes(user.id),
          getExpenses(user.id),
        ]);
        setLocalIncomes(incomesData.incomes ?? []);
        setLocalExpenses(expensesData.expenses ?? []);
        setLanguage(user.language as Language);
        if (user.email !== "patrik@mail.com") {
          setTrialPeriodAlert(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setInitialFetching(false);
      }
    };

    fetchData();
  }, [user?.id]);

  useEffect(() => {
    if (!refreshData || !user?.id) return;

    const fetchData = async () => {
      try {
        const [incomesData, expensesData] = await Promise.all([
          getIncomes(user.id),
          getExpenses(user.id),
        ]);
        setLocalIncomes(incomesData.incomes ?? []);
        setLocalExpenses(expensesData.expenses ?? []);
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        setRefreshData(false);
      }
    };

    fetchData();
  }, [refreshData, user?.id]);

  useEffect(() => {
    const newLang = user?.language;
    i18n.changeLanguage(newLang);
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        toast,
        setToast,
        user,
        setUser,
        isSidebarOpen,
        setIsSidebarOpen,
        localIncomes,
        setLocalIncomes,
        localExpenses,
        setLocalExpenses,
        initialFetching,
        setInitialFetching,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        confirmAction,
        setConfirmAction,
        incomeDetail,
        setIncomeDetail,
        expenseDetail,
        setExpenseDetail,
        refreshData,
        setRefreshData,
        billingCycle,
        setBillingCycle,
        trialPeriodAlert,
        setTrialPeriodAlert,
        profileDetail,
        setProfileDetail,
        accountSettingsDetail,
        setAccountSettingsDetail,
        refreshUser,
        language,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
