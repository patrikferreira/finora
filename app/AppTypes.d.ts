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
};

export type ConfirmAction = {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

/* USER */
export type User = {
  id?: string;
  name: string;
  email: string;
  password: string;
};

export type UserRegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type UserAuth = {
  email: string;
  password: string;
};

export type UserAuthenticated = {
  id: string;
  name: string;
  email: string;
};

/* INCOMES */
export type Income = {
  id?: string;
  userId?: string;
  description: string;
  amount: number;
  category?: string;
  cycle?: string;
};
