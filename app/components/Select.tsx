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
        className={`w-full border border-(--border-primary) rounded-xl px-4 py-2.5 bg-(--bg-secondary) text-(--foreground) text-left flex justify-between items-center focus:border-(--border-secondary) outline-none h-11 ${
          btnClassName ?? ""
        }`}
      >
        <span className="text-sm">{selectedLabel}</span>
        <span className="ml-2">
          <MdOutlineKeyboardArrowDown size={14} />
        </span>
      </button>

      {open && (
        <Popover
          onClose={() => setOpen(false)}
          className="mt-1 rounded-xl p-1 !max-h-42 w-full"
        >
          {options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 min-h-10 rounded-xl transition-all duration-200 hover:bg-(--bg-secondary) flex justify-between items-center text-(--foreground)`}
            >
              <span className="text-sm">{option.label}</span>
              {value === option.value && (
                <span>
                  <FaCheck size={12} />
                </span>
              )}
            </button>
          ))}
        </Popover>
      )}
    </div>
  );
}
