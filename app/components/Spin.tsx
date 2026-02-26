type Props = {
  className?: string;
};

export default function Spin({ className }: Props) {
  return (
    <div className={`min-h-4 min-w-4 border-2 border-solid border-white/70 rounded-full border-t-(--primary) animate-spin ${className}`}></div>
  );
}
