import React, { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { Message } from "./ConversationSidebar";

type Props = {
  messages: Message[];
  isThinking: boolean;
  onSend: (message: string, useProjectKnowledge: boolean) => void;
};

const suggestions = [
  "Summarise this project",
  "Which tasks are still open?",
  "What has been completed so far?",
];

const ChatLayout: React.FC<Props> = ({ messages, isThinking, onSend }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isThinking]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 py-14 sm:px-6">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <Sparkles className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              How can I help you today?
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Intellecta answers from the projects and tasks in your workspace.
            </p>
          </div>

          <ChatInput onSend={onSend} disabled={isThinking} />

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSend(suggestion, true)}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-14 sm:px-6 sm:pb-6 xl:pt-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} sender={msg.sender} text={msg.text} isError={msg.isError} />
          ))}
          {isThinking && messages[messages.length - 1]?.sender === "user" && (
            <div className="pl-10">
              <TypingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="mx-auto w-full max-w-2xl">
          <ChatInput onSend={onSend} disabled={isThinking} />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
