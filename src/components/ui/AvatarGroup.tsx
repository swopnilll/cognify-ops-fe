import React from "react";
import Avatar from "./Avatar";

export interface AvatarItem {
  id: string;
  src?: string;
  name?: string;
}

interface AvatarGroupProps {
  avatars: AvatarItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void; // null when deselected
  maxVisible?: number;
}

// Overlapping avatars that act as a filter: click one to select it, click
// again to clear.
const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  selectedId,
  onSelect,
  maxVisible = 5,
}) => {
  const visible = avatars.slice(0, maxVisible);
  const remaining = avatars.length - visible.length;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((avatar) => {
        const selected = selectedId === avatar.id;
        return (
          <button
            key={avatar.id}
            type="button"
            aria-pressed={selected}
            aria-label={`Filter by ${avatar.name || "user"}`}
            onClick={() => onSelect(selected ? null : avatar.id)}
            className={`rounded-full ring-2 transition hover:z-10 hover:-translate-y-0.5 ${
              selected ? "z-10 ring-brand-600" : "ring-white"
            }`}
          >
            <Avatar name={avatar.name} src={avatar.src} size={32} />
          </button>
        );
      })}

      {remaining > 0 && (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600 ring-2 ring-white">
          +{remaining}
        </span>
      )}
    </div>
  );
};

export default AvatarGroup;
