type Props = {
  logoOnly?: boolean;
};

export default function Logo({ logoOnly }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#3FD693] to-[#2EA470] flex items-center justify-center shadow-[0_4px_14px_-2px_rgba(54,189,129,0.45)]">
        <svg
          width="18"
          height="20"
          viewBox="0 0 22 24"
          className="flex-shrink-0"
          aria-hidden
        >
          <rect x="0" y="8" width="9" height="16" rx="3" fill="#0B0B0E" />
          <rect x="11" y="0" width="9" height="24" rx="3" fill="#0B0B0E" />
        </svg>
      </div>
      {!logoOnly && (
        <span className="font-semibold text-[17px] tracking-tight">Finora</span>
      )}
    </div>
  );
}
