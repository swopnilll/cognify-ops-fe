// Intellecta.tsx
import { useState, useRef, useCallback } from "react";
import ChatInput from "../ui/ChatInput";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

const BOT_REPLY = "Sure! This is a mock response simulating ChatGPT-like streaming. Feel free to customize it. 😊";

 type Message = {
  sender: "user" | "bot";
  text: string;
};


const Intellecta = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const botTextRef = useRef<string>("");

  const handleSend = useCallback((msg: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    simulateBotResponse();
  }, []);

  const simulateBotResponse = useCallback(() => {
    botTextRef.current = BOT_REPLY;
    setIsThinking(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
      let idx = 0;

      const interval = setInterval(() => {
        idx++;
        setMessages((prev) => {
          const msgs = [...prev];
          const last = msgs[msgs.length - 1];
          if (last.sender === "bot") {
            last.text = botTextRef.current.slice(0, idx);
          }
          return msgs;
        });

        if (idx >= botTextRef.current.length) {
          clearInterval(interval);
          setIsThinking(false);
        }
      }, 30);
    }, 800);
  }, []);

  const isEmpty = messages.length === 0;

  return (
    <section className="flex flex-col bg-[#F8F8FB] w-full h-full p-6">
      {/* Header */}
      <section className="flex items-center gap-4 mb-6">
        <img
          src="/images/logo.svg"
          alt="Intellecta Logo"
          className="w-[44px] h-[53.26px]"
        />
        <p className="text-xl text-[#5B6274] font-semibold">Intellecta</p>
      </section>

      {/* Chat Area */}
      <div
        className={`flex flex-col flex-1 ${
          isEmpty ? "justify-center" : "justify-end"
        } items-center transition-all`}
      >
        {isEmpty ? (
          <p className="mb-4 text-[#1868DB] text-2xl font-extrabold">
            How can I help you today?
          </p>
        ) : (
          <div className="w-full max-w-3xl flex flex-col gap-4 px-2 overflow-y-auto">
            {messages.map((msg, idx) => (
              <ChatBubble key={idx} sender={msg.sender} text={msg.text} />
            ))}
            {isThinking && <TypingIndicator />}
          </div>
        )}

        {/* Input */}
        <div className="w-full max-w-3xl mt-4 px-2">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </section>
  );
};

export default Intellecta;
