type Props = {
  className?: string;
};

export default function LoadingSpin({ className }: Props) {
  return (
    <div
      className={`h-5.5 w-5.5 border-3 border-black/20 border-t-white rounded-full animate-spin ${className}`}
    ></div>
  );
}
