import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-xl p-6 w-full max-w-md hover:shadow-lg transition ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
