import React from 'react';
import TextField from '@mui/material/TextField';

interface CognifyInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const CognifyInput: React.FC<CognifyInputProps> = ({
  label = 'Label',
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  multiline = false,
  rows = 4,
  required = false,
  disabled = false,
  fullWidth = true,
}) => {
  return (
    <TextField
      label={label}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      error={!!error}
      helperText={error}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      variant="outlined"
      size="small"
    />
  );
};

export default CognifyInput;
