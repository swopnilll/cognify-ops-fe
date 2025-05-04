import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent
} from '@mui/material';

interface CognifySelectProps<T extends string | number> {
  label?: string;
  value?: T;
  onChange?: (value: T) => void;
  options: { label: string; value: T }[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

function CognifySelect<T extends string | number>({
  label = 'Select',
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  fullWidth = true
}: CognifySelectProps<T>) {
  const id = `cognify-select-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const selectedValue = event.target.value as T;
    onChange?.(selectedValue);
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      error={!!error}
      size="small"
    >
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value as any}
        onChange={handleChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}

export default CognifySelect;
