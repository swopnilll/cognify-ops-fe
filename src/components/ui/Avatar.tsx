import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number; // pixel size
  title?: string;
  className?: string; // optional styling override
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User Avatar",
  size = 32,
  title = "",
  className = "",
}) => {
  return (
    <div
      title={title}
      className={`rounded-full overflow-hidden bg-gray-100 border border-gray-300 flex items-center justify-center shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <UserCircleIcon
          className="text-gray-400"
          style={{ width: size * 0.8, height: size * 0.8 }}
        />
      )}
    </div>
  );
};

export default Avatar;
