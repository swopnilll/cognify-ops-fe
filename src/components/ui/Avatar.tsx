import React from "react";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: number; // pixels
  className?: string;
}

const palette = [
  "bg-brand-100 text-brand-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("") || "?";

// Same name always gets the same colour.
const colourOf = (name: string) => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
};

const Avatar: React.FC<AvatarProps> = ({ name = "", src, size = 32, className = "" }) => {
  const style = { width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.38)) };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        title={name}
        style={style}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      title={name}
      style={style}
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold ${
        name ? colourOf(name) : "bg-slate-100 text-slate-400"
      } ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
};

export default Avatar;
