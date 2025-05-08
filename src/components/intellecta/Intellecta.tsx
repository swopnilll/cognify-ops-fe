import { useState, useRef, useCallback } from "react";
import ConversationSidebar, {
  Conversation,
  Message,
} from "./ConversationSidebar";
import ChatLayout from "./ChatLayout";
import { streamOpenAIResponse } from "../../services/intellectaService";

const Intellecta = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const botTextRef = useRef<string>("");

  const handleSend = useCallback(
    async (msg: string) => {
      if (!msg.trim()) return;

      const timestamp = new Date().toISOString();
      setIsThinking(true);

      // Add user message
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: msg, timestamp },
      ]);

      let botReply = "";

      try {
        await streamOpenAIResponse(
          msg,
          (chunk) => {
            botReply += chunk;
            botTextRef.current = botReply;

            // Streaming bot response
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.sender === "bot") {
                // Instead of slicing, append to the last message
                const updated = [
                  ...prev.slice(0, -1),
                  { ...last, text: botReply },
                ];
                return updated;
              }
              return [...prev, { sender: "bot", text: botReply, timestamp }];
            });
          },
          () => {
            const date = new Date().toDateString();
            const id = `${date}-${Date.now()}`;
            const fullBotMessage: Message = {
              sender: "bot",
              text: botReply,
              timestamp,
            };

            const fullUserMessage: Message = {
              sender: "user",
              text: msg,
              timestamp,
            };

            const newConversation: Conversation = {
              id,
              date,
              messages: [fullUserMessage, fullBotMessage],
            };

            if (!selectedConversationId) {
              setConversations((prev) => [...prev, newConversation]);
              setSelectedConversationId(id);
            } else {
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.id === selectedConversationId
                    ? {
                        ...conv,
                        messages: [
                          ...conv.messages,
                          fullUserMessage,
                          fullBotMessage,
                        ],
                      }
                    : conv
                )
              );
            }

            setIsThinking(false);
          },
          (err) => {
            console.error("❌ Streaming failed:", err);
            setIsThinking(false);
            // Optional: Display an error message to the user
          }
        );
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setIsThinking(false);
        // Optional: Display an error message to the user
      }
    },
    [selectedConversationId, conversations]
  );

  return (
    <section className="relative flex w-full h-full bg-[#F8F8FB]">
      {/* Chat Area */}
      <div className="w-full">
        <ChatLayout
          messages={messages}
          isThinking={isThinking}
          onSend={handleSend}
        />
      </div>

      {/* Sidebar */}
      <ConversationSidebar
        isOpen={isSidebarOpen}
        conversations={conversations}
        selectedId={selectedConversationId}
        onSelect={(id) => {
          if (id === "new") {
            setMessages([]);
            setSelectedConversationId(null);
            return;
          }
          const selected = conversations.find((c) => c.id === id);
          if (selected) {
            setMessages(selected.messages);
            setSelectedConversationId(id);
          }
        }}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Floating toggle button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-2 py-1 rounded-l-md shadow-md hover:bg-blue-700 z-50"
        >
          &#8592;
        </button>
      )}
    </section>
  );
};

export default Intellecta;
