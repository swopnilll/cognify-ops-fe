import { useId } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps<T extends string | number> {
  label: string;
  value: T | "";
  onChange: (value: string) => void;
  options: { label: string; value: T }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

function Select<T extends string | number>({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  error,
  disabled = false,
}: SelectProps<T>) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full appearance-none rounded-lg border bg-white py-2 pl-3 pr-9 text-base shadow-sm sm:text-sm transition focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
            value === "" ? "text-slate-400" : "text-slate-900"
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-300 focus:border-brand-500 focus:ring-brand-500/20"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-slate-900">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Select;
