type Props = {
  className?: string;
};

export default function Spin({ className }: Props) {
  return (
    <div
      className={`min-h-4 min-w-4 border-2 border-solid border-current/30 rounded-full border-t-current animate-spin ${className}`}
    ></div>
  );
}
