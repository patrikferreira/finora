type Props = {
  className?: string;
};

export default function Spin({ className }: Props) {
  return (
    <div className={`min-h-4 min-w-4 border-2 border-solid border-white/70 rounded-xl border-t-(--primary-color) animate-spin ${className}`}></div>
  );
}
