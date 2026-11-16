import { ReactNode } from "react";

type Props = {
  title: string;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
};

export default function DashboardCard({
  title,
  aside,
  className,
  children,
}: Props) {
  return (
    <section
      className={`surface flex flex-col min-w-0 ${className ?? ""}`}
    >
      <header className="flex items-center justify-between gap-3 px-4 md:px-5 pt-4 md:pt-5">
        <h2 className="text-base font-semibold tracking-tight truncate">
          {title}
        </h2>
        {aside}
      </header>
      <div className="flex flex-col flex-1 min-h-0 px-4 md:px-5 pt-4 pb-4 md:pb-5">
        {children}
      </div>
    </section>
  );
}

type EmptyProps = {
  text: string;
  action?: ReactNode;
};

export function DashboardCardEmpty({ text, action }: EmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 min-h-40 text-center">
      <p className="text-sm text-(--muted)">{text}</p>
      {action}
    </div>
  );
}
