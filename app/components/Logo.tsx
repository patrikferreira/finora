type Props = {
  logoOnly?: boolean;
};

export default function Logo({ logoOnly }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-[28px] w-[28px] flex-shrink-0 rounded-[9px] bg-(--primary) shadow-(--shadow-button) flex items-center justify-center">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-(--on-primary)"
          aria-hidden
        >
          <rect
            x="1.5"
            y="6"
            width="4.5"
            height="7"
            rx="1.25"
            fill="currentColor"
          />
          <rect
            x="8"
            y="1.5"
            width="4.5"
            height="11.5"
            rx="1.25"
            fill="currentColor"
          />
        </svg>
      </div>
      {!logoOnly && (
        <span className="font-bold text-lg tracking-tight">Finora</span>
      )}
    </div>
  );
}
