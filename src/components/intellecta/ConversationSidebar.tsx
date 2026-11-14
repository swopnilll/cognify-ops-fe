import React, { useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import { ConversationSummary } from "../../services/conversationService";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";

export type Message = {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isError?: boolean;
  isPaused?: boolean;
};

type Props = {
  isOpen: boolean;
  conversations: ConversationSummary[];
  isLoading: boolean;
  isError: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
  onRename: (id: number, title: string) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
  onToggle: () => void;
};

const MAX_TITLE_LENGTH = 80;

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  });
};

const iconButton =
  "rounded-md p-1.5 text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 disabled:opacity-50";

const ConversationSidebar: React.FC<Props> = ({
  isOpen,
  conversations,
  isLoading,
  isError,
  selectedId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  onToggle,
}) => {
  // One row at a time can be in rename or delete-confirmation mode.
  const [action, setAction] = useState<{ id: number; mode: "rename" | "delete" } | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const startRename = (conversation: ConversationSummary) => {
    setDraftTitle(conversation.title);
    setAction({ id: conversation.conversation_id, mode: "rename" });
  };

  // Runs a rename or delete; the row leaves its edit mode only on success.
  const run = async (request: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await request();
      setAction(null);
    } catch {
      // The parent shows the error; keep the row open to try again.
    } finally {
      setBusy(false);
    }
  };

  const submitRename = (conversation: ConversationSummary) => {
    const title = draftTitle.trim();
    if (!title || title === conversation.title) {
      setAction(null);
      return;
    }
    run(() => onRename(conversation.conversation_id, title));
  };

  const renderRow = (conversation: ConversationSummary) => {
    const id = conversation.conversation_id;
    const mode = action?.id === id ? action.mode : null;
    const selected = selectedId === id;

    if (mode === "rename") {
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitRename(conversation);
          }}
          className="flex items-center gap-1 rounded-lg bg-slate-100 p-1.5"
        >
          <input
            autoFocus
            aria-label="Chat name"
            value={draftTitle}
            maxLength={MAX_TITLE_LENGTH}
            disabled={busy}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={(event) => event.key === "Escape" && setAction(null)}
            className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
          />
          <button type="submit" aria-label="Save name" disabled={busy} className={iconButton}>
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Cancel"
            disabled={busy}
            onClick={() => setAction(null)}
            className={iconButton}
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      );
    }

    if (mode === "delete") {
      return (
        <div className="rounded-lg bg-red-50 p-2.5">
          <p className="truncate text-sm font-medium text-red-800">Delete “{conversation.title}”?</p>
          <p className="mt-0.5 text-xs text-red-700">This cannot be undone.</p>
          <div className="mt-2 flex gap-2">
            <Button variant="danger" size="sm" loading={busy} onClick={() => run(() => onDelete(id))}>
              Delete chat
            </Button>
            <Button variant="secondary" size="sm" disabled={busy} onClick={() => setAction(null)}>
              Keep chat
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`group flex items-center rounded-lg transition-colors ${
          selected ? "bg-brand-50" : "hover:bg-slate-100"
        }`}
      >
        <button
          type="button"
          onClick={() => onSelect(id)}
          aria-current={selected ? "true" : undefined}
          className={`min-w-0 flex-1 px-3 py-2 text-left ${
            selected ? "text-brand-700" : "text-slate-700"
          }`}
        >
          <p className="truncate text-sm font-medium">{conversation.title}</p>
          <p className="mt-0.5 text-xs text-slate-400">{formatDate(conversation.updated_at)}</p>
        </button>
        {/* Always visible on touch screens; on hover or keyboard focus elsewhere. */}
        <div className="flex shrink-0 pr-1.5 lg:opacity-0 lg:focus-within:opacity-100 lg:group-hover:opacity-100">
          <button
            type="button"
            aria-label={`Rename “${conversation.title}”`}
            onClick={() => startRename(conversation)}
            className={iconButton}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Delete “${conversation.title}”`}
            onClick={() => setAction({ id, mode: "delete" })}
            className={iconButton}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  };

  const renderList = () => {
    if (isLoading) return <Spinner className="py-6!" />;

    if (isError) {
      return (
        <p className="px-1 py-2 text-sm text-red-600">
          Your chats could not be loaded. Refresh the page to try again.
        </p>
      );
    }

    if (conversations.length === 0) {
      return <p className="px-1 py-2 text-sm text-slate-400">Your saved chats will appear here.</p>;
    }

    return (
      <ul className="flex flex-col gap-1">
        {conversations.map((conversation) => (
          <li key={conversation.conversation_id}>{renderRow(conversation)}</li>
        ))}
      </ul>
    );
  };

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
          onClick={onNew}
        >
          New chat
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">{renderList()}</div>
    </aside>
    </>
  );
};

export default ConversationSidebar;
