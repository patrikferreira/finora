type Props = {
  className?: string;
};

export default function LoadingSpin({ className }: Props) {
  return (
    <span
      className={`
        inline-block
        w-[26px] h-[26px]
        rounded-full
        box-border
        border-t-[2.5px] border-t-[var(--primary)]
        border-r-[2.5px] border-r-transparent
        border-b-[2.5px] border-b-transparent
        border-l-[2.5px] border-l-transparent
        animate-spin
        ${className}
      `}
    />
  );
}
