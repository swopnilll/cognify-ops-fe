// components/ui/AvatarGroup.tsx
import React, { useState } from "react";
import clsx from "clsx";

interface Avatar {
  id: number;
  src?: string;
  name?: string;
}

interface AvatarGroupProps {
  avatars: Avatar[];
  maxVisible?: number;
  onSelect?: (user: Avatar | null) => void; // null if deselected
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  maxVisible = 3,
  onSelect,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleClick = (avatar: Avatar) => {
    const newSelected = selectedId === avatar.id ? null : avatar.id;
    setSelectedId(newSelected);
    onSelect?.(newSelected === null ? null : avatar);
  };

  const visible = avatars.slice(0, maxVisible);
  const remaining = avatars.length - visible.length;

  return (
    <div className="flex items-center space-x-[-8px]">
      {visible.map((avatar) => (
        <div
          key={avatar.id}
          className={clsx(
            "w-8 h-8 rounded-full border-2 cursor-pointer shadow",
            selectedId === avatar.id
              ? "border-blue-500 ring-2 ring-blue-500"
              : "border-white"
          )}
          onClick={() => handleClick(avatar)}
        >
          <img
            src={
              avatar.src ||
              `https://ui-avatars.com/api/?name=${avatar.name || "?"}`
            }
            alt={avatar.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      ))}

      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-200 text-sm text-gray-600 flex items-center justify-center border-2 border-white shadow">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
