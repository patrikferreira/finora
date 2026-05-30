export default function BuiltInfo() {
  return (
    <p className="text-xs text-(--muted) text-center">
      Built with{" "}
      <a
        href="https://nextjs.org/"
        target="_blank"
        className="font-medium text-(--foreground)/80 hover:text-(--primary) transition-colors"
      >
        Next.js
      </a>{" "}
      &{" "}
      <a
        href="https://supabase.com/"
        target="_blank"
        className="font-medium text-(--foreground)/80 hover:text-(--primary) transition-colors"
      >
        Supabase
      </a>
    </p>
  );
}
