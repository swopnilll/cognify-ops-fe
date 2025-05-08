import React from "react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "../ui/ChatInput";
import { Message } from "./ConversationSidebar";

type Props = {
  messages: Message[];
  isThinking: boolean;
  onSend: (msg: string) => void;
};

const ChatLayout: React.FC<Props> = ({ messages, isThinking, onSend }) => {
  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col w-full bg-[#F8F8FB] p-6">
      {/* Top branding/header */}
      <section className="flex items-center gap-4 mb-6">
        <img
          src="/images/logo.svg"
          alt="Intellecta Logo"
          className="w-[44px] h-[53.26px]"
        />
        <p className="text-xl text-[#5B6274] font-semibold">Intellecta</p>
      </section>

      {/* Main chat container */}
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center min-h-[300px]">
          <p className="mb-4 text-[#1868DB] text-2xl font-extrabold">
            How can I help you today?
          </p>
          <div className="w-full max-w-3xl px-2">
            <ChatInput onSend={onSend} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-grow max-h-[calc(100vh-200px)] overflow-hidden">
          {/* Scrollable message list */}
          <div className="flex flex-col flex-grow overflow-y-auto items-center px-2">
            <div className="w-full max-w-3xl flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} sender={msg.sender} text={msg.text} />
              ))}
              {isThinking && <TypingIndicator />}
            </div>
          </div>

          {/* Chat input */}
          <div className="w-full max-w-3xl px-2 py-4 self-center bg-[#F8F8FB]">
            <ChatInput onSend={onSend} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
