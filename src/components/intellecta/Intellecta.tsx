import { useState } from "react";
import { History } from "lucide-react";

import ConversationSidebar, { Conversation, Message } from "./ConversationSidebar";
import ChatLayout from "./ChatLayout";
import Button from "../ui/Button";
import {
  getContextBasedResponse,
  streamOpenAIResponse,
} from "../../services/intellectaService";

const ERROR_TEXT =
  "Sorry, I couldn’t get an answer. The AI service may be unavailable. Please try again.";

const Intellecta = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Adds a finished question/answer pair to the current conversation, or
  // starts a new conversation if there is none.
  const saveExchange = (userMessage: Message, botMessage: Message) => {
    if (selectedConversationId) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversationId
            ? { ...conv, messages: [...conv.messages, userMessage, botMessage] }
            : conv
        )
      );
      return;
    }

    const date = new Date().toDateString();
    const id = `${date}-${Date.now()}`;
    setConversations((prev) => [...prev, { id, date, messages: [userMessage, botMessage] }]);
    setSelectedConversationId(id);
  };

  // Replaces the bot message being streamed, or appends it if this is the first chunk.
  const upsertBotMessage = (botMessage: Message) => {
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      return last?.sender === "bot" ? [...prev.slice(0, -1), botMessage] : [...prev, botMessage];
    });
  };

  const handleSend = async (text: string, useProjectKnowledge: boolean) => {
    if (!text.trim() || isThinking) return;

    const timestamp = new Date().toISOString();
    const userMessage: Message = { sender: "user", text, timestamp };
    const errorMessage: Message = { sender: "bot", text: ERROR_TEXT, timestamp, isError: true };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      if (useProjectKnowledge) {
        // Answer grounded in the project knowledge base (returned in one piece).
        const response = await getContextBasedResponse(text);
        const botMessage: Message = { sender: "bot", text: response, timestamp };
        setMessages((prev) => [...prev, botMessage]);
        saveExchange(userMessage, botMessage);
      } else {
        // General answer, streamed in as it is generated.
        let botReply = "";
        let failed = false;

        await streamOpenAIResponse(
          text,
          (chunk) => {
            botReply += chunk;
            upsertBotMessage({ sender: "bot", text: botReply, timestamp });
          },
          undefined,
          () => {
            failed = true;
          }
        );

        if (failed || !botReply) {
          upsertBotMessage(errorMessage);
        } else {
          saveExchange(userMessage, { sender: "bot", text: botReply, timestamp });
        }
      }
    } catch {
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSelectConversation = (id: string) => {
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
  };

  return (
    <section className="flex h-full">
      <div className="relative min-w-0 flex-1">
        {!isSidebarOpen && (
          <div className="absolute right-4 top-3 z-10">
            <Button
              variant="secondary"
              size="sm"
              icon={<History className="h-4 w-4" />}
              onClick={() => setIsSidebarOpen(true)}
            >
              History
            </Button>
          </div>
        )}
        <ChatLayout messages={messages} isThinking={isThinking} onSend={handleSend} />
      </div>

      <ConversationSidebar
        isOpen={isSidebarOpen}
        conversations={conversations}
        selectedId={selectedConversationId}
        onSelect={handleSelectConversation}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
    </section>
  );
};

export default Intellecta;
