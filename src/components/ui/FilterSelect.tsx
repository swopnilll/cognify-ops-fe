import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
  label: string; // read by screen readers; the visible text is the chosen option
  value: string | number;
  onChange: (value: string) => void;
  options: { label: string; value: string | number }[];
  allLabel?: string; // adds a first option with the value ""
}

// A compact select for toolbars. Highlighted while a filter is chosen.
const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  onChange,
  options,
  allLabel,
}) => {
  const active = allLabel !== undefined && value !== "";

  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 appearance-none rounded-lg border py-0 pl-3 pr-8 text-base shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm ${
          active
            ? "border-brand-300 bg-brand-50 font-medium text-brand-700"
            : "border-slate-300 bg-white text-slate-700"
        }`}
      >
        {allLabel !== undefined && <option value="">{allLabel}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
};

export default FilterSelect;
