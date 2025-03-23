import React from "react";

type LogoProps = {
  src: string;
  alt?: string;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({
  src,
  alt = "Company Logo",
  className,
}) => {
  return <img src={src} alt={alt} className={`h-12 w-auto ${className}`} />;
};

export default Logo;
