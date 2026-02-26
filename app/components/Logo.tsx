type Props = {
  logoOnly?: boolean;
};

export default function Logo({ logoOnly }: Props) {
  return (
    <div className="flex items-baseline gap-2">
      <svg
        width="22"
        height="24"
        viewBox="0 0 22 24"
        className="flex-shrink-0"
        aria-hidden
      >
        <rect
          x="0"
          y="8"
          width="10"
          height="16"
          rx="2"
          fill="var(--primary)"
        />
        <rect
          x="12"
          y="0"
          width="10"
          height="24"
          rx="2"
          fill="var(--primary)"
        />
      </svg>

      {!logoOnly && <span className="font-semibold text-2xl">Finora</span>}
    </div>
  );
}
