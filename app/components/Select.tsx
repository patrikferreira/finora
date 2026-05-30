import { ReactNode, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import Popover from "./Popover";
import { FaCheck } from "react-icons/fa";

type Option<T> = {
  value: T;
  label: string | ReactNode;
};

type Props<T> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  className?: string;
  btnClassName?: string;
};

export default function Select<T extends string | number>({
  value,
  options,
  onChange,
  className,
  btnClassName,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full border border-(--border) rounded-xl px-3.5 bg-(--bg-secondary) text-(--foreground) text-left flex justify-between items-center hover:border-(--border-strong) transition-colors outline-none h-[42px] ${
          open
            ? "border-(--primary) shadow-[0_0_0_3px_var(--primary-soft)]"
            : ""
        } ${btnClassName ?? ""}`}
      >
        <span className="text-sm truncate">{selectedLabel}</span>
        <span
          className={`ml-2 text-(--muted) transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <MdOutlineKeyboardArrowDown size={16} />
        </span>
      </button>

      {open && (
        <Popover
          onClose={() => setOpen(false)}
          className="mt-1.5 rounded-xl p-1 !max-h-56 w-full"
        >
          {options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 min-h-9 rounded-lg transition-colors duration-150 hover:bg-(--bg-tertiary) flex justify-between items-center ${
                value === option.value
                  ? "text-(--foreground)"
                  : "text-(--muted) hover:text-(--foreground)"
              }`}
            >
              <span className="text-sm">{option.label}</span>
              {value === option.value && (
                <span className="text-(--primary)">
                  <FaCheck size={11} />
                </span>
              )}
            </button>
          ))}
        </Popover>
      )}
    </div>
  );
}
