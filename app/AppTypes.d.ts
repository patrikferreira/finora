/* APP */
export type ToastStatus = "success" | "error" | "info";

export type Toast = {
  message: string;
  status: ToastStatus;
  show: boolean;
};

export type ApiResponse = {
  message?: string;
  error?: string;
  user?: User;
  token?: string;
  status?: number;
  incomes?: Income[];
  expenses?: Expense[];
};

export type ConfirmAction = {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

export type ProfileDetail = {
  show: boolean;
};

export type AccountSettingsDetail = {
  show: boolean;
};

export type Language = "en" | "es" | "pt";


export type Currency = "USD" | "EUR" | "BRL";

/* USER */
export type User = {
  id?: string;
  name: string;
  email: string;
  password: string;
  currency?: Currency;
  language?: Language;
};

export type UserRegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type UserUpdatePayload = {
  name?: string;
  email?: string;
  currency?: Currency;
  language?: Language;
}

export type UserAuth = {
  email: string;
  password: string;
};

export type UserAuthenticated = {
  id: string;
  name: string;
  email: string;
  currency?: Currency;
  language?: Language;
};

/* INCOMES */
export type Income = {
  id?: string;
  userId?: string;
  description: string;
  amount: number | null;
  category?: IncomeCategory;
  cycle?: Cycle;
};

export type IncomeDetail = {
  show: boolean;
  newIncome: boolean;
  currentIncome: Income | null;
};

export type IncomeCategory =
  | "salary"
  | "benefit"
  | "investment"
  | "freelancer"
  | "business"
  | "other";

/* EXPENSES */
export type Expense = {
  id?: string;
  userId?: string;
  description: string;
  amount: number | null;
  category?: ExpenseCategory;
  cycle?: Cycle;
};

export type ExpenseDetail = {
  show: boolean;
  newExpense: boolean;
  currentExpense: Expense | null;
};

export type ExpenseCategory =
  | "house"
  | "transport"
  | "food"
  | "entertainment"
  | "health"
  | "education"
  | "investment"
  | "subscription"
  | "saving"
  | "other";

/* HELPERS */
export type Cycle = "monthly" | "yearly";
export type billingCycle = "monthly" | "yearly" | "totaly";
