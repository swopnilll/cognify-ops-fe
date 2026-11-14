import { useEffect, useRef, useState } from "react";
import { History } from "lucide-react";

import ConversationSidebar, { Conversation, Message } from "./ConversationSidebar";
import ChatLayout from "./ChatLayout";
import Button from "../ui/Button";
import {
  AI_ENABLED,
  getContextBasedResponse,
  streamOpenAIResponse,
} from "../../services/intellectaService";

const ERROR_TEXT =
  "Sorry, I couldn’t get an answer. The AI service may be unavailable. Please try again.";

const PAUSED_TEXT = `Sorry, I can’t answer that right now.

Intellecta’s AI is switched off on this public demo. Every answer costs tokens, and an AI that anyone on the internet can reach is easy to abuse, so it is staying off for now.

The rest of Cognify Ops works as normal: you can still create projects, add tasks and move them across the board.`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// From lg up the history sits beside the chat; below that it is a drawer.
const isWideScreen = () => window.matchMedia("(min-width: 1024px)").matches;

const Intellecta = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(isWideScreen);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Identifies the reply being typed out. Starting another chat, or leaving
  // the page, changes it so a reply still in progress stops.
  const replyRun = useRef(0);
  useEffect(
    () => () => {
      replyRun.current += 1;
    },
    []
  );

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
      if (!AI_ENABLED) {
        // No API call: type the fixed reply out word by word, like a streamed answer.
        const run = ++replyRun.current;
        await sleep(900);

        let typed = "";
        for (const word of PAUSED_TEXT.match(/\S+\s*/g) ?? []) {
          if (replyRun.current !== run) return;
          typed += word;
          upsertBotMessage({ sender: "bot", text: typed, timestamp, isPaused: true });
          // Pause a little longer at the end of a sentence or paragraph.
          await sleep(/[.:,]\s*$/.test(word) ? 170 : 25 + Math.random() * 45);
        }

        if (replyRun.current !== run) return;
        saveExchange(userMessage, { sender: "bot", text: PAUSED_TEXT, timestamp, isPaused: true });
      } else if (useProjectKnowledge) {
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
    replyRun.current += 1; // stop a reply that is still being typed
    setIsThinking(false);
    if (!isWideScreen()) setIsSidebarOpen(false);
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
          <div className="absolute right-3 top-3 z-10 sm:right-4">
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
