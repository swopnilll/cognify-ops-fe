import { useState, useRef, useEffect } from "react";
import { ArrowUp, BookOpen } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string, useProjectKnowledge: boolean) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [useProjectKnowledge, setUseProjectKnowledge] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grow the textarea with its content, up to a limit.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const canSend = message.trim() !== "" && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    onSend(message.trim(), useProjectKnowledge);
    setMessage("");
  };

  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-3 shadow-sm transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Intellecta anything…"
        aria-label="Message"
        className="block w-full resize-none bg-transparent px-1 text-base leading-relaxed text-slate-900 sm:text-sm outline-none placeholder:text-slate-400"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        // Focusing on a phone would open the keyboard over the page straight away.
        autoFocus={window.matchMedia("(pointer: fine)").matches}
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-pressed={useProjectKnowledge}
          onClick={() => setUseProjectKnowledge((prev) => !prev)}
          title={
            useProjectKnowledge
              ? "Answers use your projects and tasks"
              : "Answers come from general knowledge only"
          }
          className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium ring-1 ring-inset transition-colors ${
            useProjectKnowledge
              ? "bg-brand-50 text-brand-700 ring-brand-600/20"
              : "bg-white text-slate-500 ring-slate-300 hover:bg-slate-50"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Project knowledge {useProjectKnowledge ? "on" : "off"}
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 sm:h-8 sm:w-8 text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
