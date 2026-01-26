type Props = {
    className?: string;
  };
  
  export default function Logo({ className }: Props) {
    return (
      <div className="flex items-baseline gap-2">
          <div className="flex items-baseline gap-0.5">
              <svg
                className="h-2 w-1.5 rounded-sm bg-(--color-primary)"
                viewBox="0 0 6 24"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="true"
              >
                <rect width="100%" height="100%" rx="2" fill="var(--color-primary)" />
              </svg>
  
              <svg
                className="h-4 w-1.5 rounded-sm bg-(--color-primary)"
                viewBox="0 0 6 24"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="true"
              >
                <rect width="100%" height="100%" rx="2" fill="var(--color-primary)" />
              </svg>
  
              <svg
                className="h-6 w-1.5 rounded-sm bg-(--color-primary)"
                viewBox="0 0 6 24"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="true"
              >
                <rect width="100%" height="100%" rx="2" fill="var(--color-primary)" />
              </svg>
          </div>
          <span className="text-(--color-primary) font-semibold text-xl">
              Finora
          </span>
      </div>
    )
  }