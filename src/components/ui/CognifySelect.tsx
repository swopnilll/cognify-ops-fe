import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface CognifySelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const CognifySelect: React.FC<CognifySelectProps> = ({
  label = 'Select',
  value = '',
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  fullWidth = true,
}) => {
  const id = `cognify-select-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <FormControl fullWidth={fullWidth} required={required} disabled={disabled} error={!!error} size="small">
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
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
};

export default CognifySelect;
