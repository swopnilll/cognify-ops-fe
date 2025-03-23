import React from "react";
import Button from "@mui/material/Button";
import { SxProps, Theme } from "@mui/material/styles";

type CognifyButtonProps = {
  label: string;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "success" | "warning";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  disabled?: boolean;
  customColor?: string;
  textColor?: string;
  sx?: SxProps<Theme>;
};

const CognifyButton: React.FC<CognifyButtonProps> = ({
  label,
  variant = "contained",
  color,
  size = "medium",
  onClick,
  disabled = false,
  customColor,
  textColor,
  sx = {},
}) => {
  const customStyles: SxProps<Theme> = {
    backgroundColor: customColor || "inherit",
    color: textColor || "inherit",
    ...sx,
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      disabled={disabled}
      sx={customStyles}
    >
      {label}
    </Button>
  );
};

export default CognifyButton;
