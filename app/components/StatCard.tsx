import { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  icon: ReactNode;
  iconClassName?: string;
  highlight?: boolean;
  className?: string;
  children?: ReactNode;
};

export default function StatCard({
  label,
  value,
  icon,
  iconClassName,
  highlight = false,
  className,
  children,
}: Props) {
  const surface = highlight
    ? "border-transparent text-(--on-primary) shadow-(--shadow-button)"
    : "surface";
  const secondary = highlight ? "text-(--on-primary)/75" : "text-(--muted)";
  const iconSurface =
    iconClassName ??
    (highlight
      ? "bg-(--on-primary)/15 text-(--on-primary)"
      : "bg-(--bg-muted) text-(--primary)");

  return (
    <div
      className={`relative overflow-hidden flex flex-col gap-3 min-w-0 p-4 md:p-5 rounded-2xl border ${surface} ${className ?? ""}`}
      style={
        highlight
          ? {
              background:
                "linear-gradient(145deg, color-mix(in srgb, var(--primary) 92%, white) 0%, var(--primary) 55%, color-mix(in srgb, var(--primary) 82%, #0b1f19) 100%)",
            }
          : undefined
      }
    >
      <div className="relative flex items-center justify-between gap-2">
        <p className={`text-sm font-medium truncate ${secondary}`}>{label}</p>
        <span
          aria-hidden
          className={`h-8 w-8 shrink-0 rounded-xl flex items-center justify-center ${iconSurface}`}
        >
          {icon}
        </span>
      </div>
      <p className="relative text-2xl md:text-[28px] md:leading-9 font-extrabold tracking-tight tabular-nums truncate">
        {value}
      </p>
      <div className={`relative flex items-center min-h-6 text-xs ${secondary}`}>
        {children}
      </div>
    </div>
  );
}
