import React from "react";
import { Plus, X } from "lucide-react";

import Button from "../ui/Button";

export type Message = {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isError?: boolean;
  isPaused?: boolean;
};

export type Conversation = {
  id: string;
  date: string;
  messages: Message[];
};

type Props = {
  isOpen: boolean;
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggle: () => void;
};

const ConversationSidebar: React.FC<Props> = ({
  isOpen,
  conversations,
  selectedId,
  onSelect,
  onToggle,
}) => {
  if (!isOpen) return null;

  return (
    <>
    {/* Below lg the history is a drawer over the chat; this is its backdrop. */}
    <div
      aria-hidden="true"
      onClick={onToggle}
      className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
    />
    <aside className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] shrink-0 flex-col border-l border-slate-200 bg-white shadow-xl lg:static lg:z-auto lg:w-64 lg:max-w-none lg:shadow-none">
      <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
        <p className="text-sm font-semibold text-slate-900">History</p>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Hide history"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3">
        <Button
          variant="secondary"
          fullWidth
          icon={<Plus className="h-4 w-4" />}
          onClick={() => onSelect("new")}
        >
          New chat
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {conversations.length === 0 ? (
          <p className="px-1 py-2 text-sm text-slate-400">
            Your chats from this session will appear here.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {[...conversations].reverse().map((conv) => (
              <li key={conv.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conv.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                    selectedId === conv.id
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <p className="truncate text-sm font-medium">
                    {conv.messages[0]?.text ?? "New chat"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">{conv.date}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
    </>
  );
};

export default ConversationSidebar;
