import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number; // pixel size
  title?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User Avatar",
  title,
  size = 32,
}) => {
  // const sizeClass = `h-[${size}px] w-[${size}px]`;

  return (
    <div
      className={`rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          title={title}
        />
      ) : (
        <UserCircleIcon
          className="text-gray-500"
          style={{ width: size, height: size }}
        />
      )}
    </div>
  );
};

export default Avatar;
