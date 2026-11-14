import { Sparkles } from "lucide-react";

type Props = {
  sender: "user" | "bot";
  text: string;
  isError?: boolean;
};

const ChatBubble = ({ sender, text, isError = false }: Props) => {
  if (sender === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm leading-relaxed text-white">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tl-md px-4 py-2.5 text-sm leading-relaxed ${
          isError
            ? "border border-red-200 bg-red-50 text-red-700"
            : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatBubble;
