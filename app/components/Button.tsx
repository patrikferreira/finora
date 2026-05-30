import { useTranslation } from "react-i18next";
import Spin from "./Spin";
import { ReactNode } from "react";

type Props = {
  type?: "button" | "submit" | "reset";
  action?: () => void;
  isLoading?: boolean;
  text?: string;
  icon?: ReactNode;
  hiddenTextOnMobile?: boolean;
  className?: string;
};

export default function Button({
  type = "button",
  action,
  isLoading,
  text,
  icon,
  hiddenTextOnMobile = false,
  className,
}: Props) {
  const { t } = useTranslation();
  return (
    <button
      type={type}
      onClick={action}
      disabled={isLoading}
      className={`h-10 px-3.5 min-w-[80px] flex items-center justify-center gap-2 text-sm font-medium rounded-xl transition-all duration-150 hover:brightness-110 active:brightness-95 disabled:opacity-60 ${
        isLoading ? "cursor-default" : "cursor-pointer"
      } ${className}`}
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
