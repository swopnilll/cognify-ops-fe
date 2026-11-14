import React, { useId } from "react";

interface TextFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
}

const fieldClasses =
  "block w-full rounded-lg border bg-white px-3 py-2 text-base text-slate-900 sm:text-sm placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500";

const TextField: React.FC<TextFieldProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  multiline = false,
  rows = 3,
  required = false,
  disabled = false,
  autoComplete,
  autoFocus,
}) => {
  const id = useId();
  const stateClasses = error
    ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
    : "border-slate-300 focus:border-brand-500 focus:ring-brand-500/20";

  const shared = {
    id,
    placeholder,
    value,
    disabled,
    autoFocus,
    "aria-invalid": !!error,
    className: `${fieldClasses} ${stateClasses}`,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {!required && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>

      {multiline ? (
        <textarea {...shared} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
};

export default TextField;
