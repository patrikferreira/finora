import { useTranslation } from "react-i18next";
import Spin from "./Spin";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "dangerOutline";

type Props = {
  type?: "button" | "submit" | "reset";
  action?: () => void;
  isLoading?: boolean;
  text?: string;
  icon?: ReactNode;
  hiddenTextOnMobile?: boolean;
  variant?: Variant;
  className?: string;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-(--primary) text-(--on-primary) shadow-(--shadow-button) hover:brightness-110 active:brightness-95",
  secondary:
    "bg-(--bg-secondary) text-(--foreground) border border-(--border) shadow-sm hover:bg-(--bg-muted) hover:border-(--border-strong)",
  danger:
    "bg-(--danger) text-(--on-primary) shadow-sm hover:brightness-110 active:brightness-95",
  dangerOutline:
    "bg-transparent text-(--danger-ink) border border-(--border) hover:border-(--danger) hover:bg-(--danger-soft)",
};

export default function Button({
  type = "button",
  action,
  isLoading,
  text,
  icon,
  hiddenTextOnMobile = false,
  variant = "primary",
  className,
}: Props) {
  const { t } = useTranslation();
  return (
    <button
      type={type}
      onClick={action}
      disabled={isLoading}
      className={`h-9 px-3.5 min-w-[80px] flex items-center justify-center gap-2 text-sm font-semibold rounded-xl transition-all duration-150 disabled:opacity-70 ${
        variants[variant]
      } ${isLoading ? "cursor-default" : "cursor-pointer"} ${className ?? ""}`}
    >
      {icon}
      {isLoading ? (
        <Spin />
      ) : (
        text && (
          <span className={hiddenTextOnMobile ? "hidden md:inline" : ""}>
            {t(text)}
          </span>
        )
      )}
    </button>
  );
}
