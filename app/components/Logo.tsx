type Props = {
  logoOnly?: boolean;
};

export default function Logo({ logoOnly }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 rounded-xl bg-(--primary) flex items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="flex-shrink-0"
          aria-hidden
        >
          <rect x="4" y="12" width="4" height="8" rx="2" fill="#fff" />
          <rect x="10" y="8" width="4" height="12" rx="2" fill="#fff" />
          <rect x="16" y="4" width="4" height="16" rx="2" fill="#fff" />
        </svg>
      </div>
      {!logoOnly && (
        <span className="font-semibold text-[17px] tracking-tight">Finora</span>
      )}
    </div>
  );
}
