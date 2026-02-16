type Props = {
  className?: string;
};

export default function LoadingSpin({ className }: Props) {
  return (
    <span
      className={`
        inline-block
        w-[25px] h-[25px]
        rounded-xl
        box-border
        border-t-[3px] border-t-[var(--primary-color)]
        border-r-[3px] border-r-transparent
        animate-spin
        ${className}
      `}
    />
  );
}
