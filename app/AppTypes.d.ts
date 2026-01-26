export type ToastStatus = "success" | "error" | "info";

export type Toast = {
  message: string;
  status: ToastStatus;
  show: boolean;
};
