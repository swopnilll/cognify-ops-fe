import { CirclePause, Sparkles } from "lucide-react";

type Props = {
  sender: "user" | "bot";
  text: string;
  isError?: boolean;
  isPaused?: boolean; // the canned "AI is switched off" reply
  isStreaming?: boolean; // still being typed out
};

const ChatBubble = ({
  sender,
  text,
  isError = false,
  isPaused = false,
  isStreaming = false,
}: Props) => {
  if (sender === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm leading-relaxed text-white">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 sm:gap-3">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm">
        <Sparkles className="h-3.5 w-3.5" />
      </span>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex h-7 items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">Intellecta</span>
          {isPaused && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
              <CirclePause className="h-3 w-3" />
              AI paused
            </span>
          )}
        </div>

        <div
          aria-live="polite"
          className={`whitespace-pre-wrap break-words text-sm leading-relaxed ${
            isError
              ? "rounded-2xl rounded-tl-md border border-red-200 bg-red-50 px-4 py-2.5 text-red-700"
              : "text-slate-700"
          }`}
        >
          {text}
          {isStreaming && (
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-4 w-[3px] translate-y-[3px] animate-pulse rounded-full bg-brand-600"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
