import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { History } from "lucide-react";

import ConversationSidebar, { Message } from "./ConversationSidebar";
import ChatLayout from "./ChatLayout";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import {
  addConversationMessages,
  createConversation,
  deleteConversation,
  fetchConversationMessages,
  fetchConversations,
  NewMessage,
  renameConversation,
  StoredMessage,
} from "../../services/conversationService";
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

const conversationsQueryKey = (projectId: number) => ["conversations", projectId] as const;

const toNewMessage = (message: Message): NewMessage => ({
  sender: message.sender,
  text: message.text,
  is_error: message.isError ?? false,
  is_paused: message.isPaused ?? false,
});

const toMessage = (stored: StoredMessage): Message => ({
  sender: stored.sender,
  text: stored.text,
  timestamp: stored.created_at,
  isError: stored.is_error,
  isPaused: stored.is_paused,
});

interface Props {
  projectId: number;
}

// The chat with Intellecta. Every finished question and answer is saved on
// the server, so the history is still there after a refresh or on another
// device. The history belongs to the signed-in user and this project.
const Intellecta = ({ projectId }: Props) => {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(isWideScreen);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  const conversationsQuery = useQuery({
    queryKey: conversationsQueryKey(projectId),
    queryFn: () => fetchConversations(projectId),
  });
  const refreshConversations = () =>
    queryClient.invalidateQueries({ queryKey: conversationsQueryKey(projectId) });

  // The conversation on screen, readable from a reply that is still running.
  const selectedIdRef = useRef<number | null>(null);
  const selectConversation = (id: number | null) => {
    selectedIdRef.current = id;
    setSelectedConversationId(id);
  };

  // Identifies the chat on screen. Opening another chat, or leaving the page,
  // changes it, so a reply still in progress stops updating the screen.
  const chatSession = useRef(0);
  useEffect(
    () => () => {
      chatSession.current += 1;
    },
    []
  );

  // Saves a finished question/answer pair: added to the conversation it was
  // asked in, or stored as a new conversation.
  const saveExchange = async (
    userMessage: Message,
    botMessage: Message,
    conversationId: number | null,
    session: number
  ) => {
    const exchange = [toNewMessage(userMessage), toNewMessage(botMessage)];

    try {
      if (conversationId !== null) {
        await addConversationMessages(conversationId, exchange);
      } else {
        const created = await createConversation(projectId, exchange);
        // Follow-up questions go to the new conversation, unless the user
        // has opened a different chat in the meantime.
        if (chatSession.current === session) selectConversation(created.conversation_id);
      }
      refreshConversations();
    } catch {
      toast.error("This chat could not be saved. It will be gone when you leave the page.");
    }
  };

  const handleSend = async (text: string, useProjectKnowledge: boolean) => {
    if (!text.trim() || isThinking) return;

    const session = chatSession.current;
    const conversationId = selectedIdRef.current;
    const isCurrent = () => chatSession.current === session;
    // Screen updates of a chat the user has left are dropped.
    const show = (update: (previous: Message[]) => Message[]) => {
      if (isCurrent()) setMessages(update);
    };
    // Replaces the bot message being streamed, or appends it if this is the first chunk.
    const upsertBotMessage = (botMessage: Message) =>
      show((prev) => {
        const last = prev[prev.length - 1];
        return last?.sender === "bot" ? [...prev.slice(0, -1), botMessage] : [...prev, botMessage];
      });

    const timestamp = new Date().toISOString();
    const userMessage: Message = { sender: "user", text, timestamp };
    const errorMessage: Message = { sender: "bot", text: ERROR_TEXT, timestamp, isError: true };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    try {
      if (!AI_ENABLED) {
        // No API call: type the fixed reply out word by word, like a streamed answer.
        await sleep(900);

        let typed = "";
        for (const word of PAUSED_TEXT.match(/\S+\s*/g) ?? []) {
          if (!isCurrent()) return;
          typed += word;
          upsertBotMessage({ sender: "bot", text: typed, timestamp, isPaused: true });
          // Pause a little longer at the end of a sentence or paragraph.
          await sleep(/[.:,]\s*$/.test(word) ? 170 : 25 + Math.random() * 45);
        }

        if (!isCurrent()) return;
        await saveExchange(
          userMessage,
          { sender: "bot", text: PAUSED_TEXT, timestamp, isPaused: true },
          conversationId,
          session
        );
      } else if (useProjectKnowledge) {
        // Answer grounded in the project knowledge base (returned in one piece).
        const response = await getContextBasedResponse(text);
        const botMessage: Message = { sender: "bot", text: response, timestamp };
        show((prev) => [...prev, botMessage]);
        await saveExchange(userMessage, botMessage, conversationId, session);
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
          await saveExchange(userMessage, errorMessage, conversationId, session);
        } else {
          await saveExchange(
            userMessage,
            { sender: "bot", text: botReply, timestamp },
            conversationId,
            session
          );
        }
      }
    } catch {
      show((prev) => [...prev, errorMessage]);
      await saveExchange(userMessage, errorMessage, conversationId, session);
    } finally {
      if (isCurrent()) setIsThinking(false);
    }
  };

  const handleNewChat = () => {
    chatSession.current += 1; // stop a reply that is still being typed
    setIsThinking(false);
    setIsLoadingMessages(false);
    if (!isWideScreen()) setIsSidebarOpen(false);
    setMessages([]);
    selectConversation(null);
  };

  const handleSelectConversation = async (id: number) => {
    const session = ++chatSession.current; // stop a reply that is still being typed
    setIsThinking(false);
    if (!isWideScreen()) setIsSidebarOpen(false);
    selectConversation(id);
    setMessages([]);
    setIsLoadingMessages(true);

    try {
      const stored = await fetchConversationMessages(id);
      if (chatSession.current !== session) return;
      setMessages(stored.map(toMessage));
    } catch {
      if (chatSession.current !== session) return;
      toast.error("This chat could not be opened. Please try again.");
      selectConversation(null);
    } finally {
      if (chatSession.current === session) setIsLoadingMessages(false);
    }
  };

  const handleRename = async (id: number, title: string) => {
    try {
      await renameConversation(id, title);
      await refreshConversations();
    } catch (error) {
      toast.error("The chat could not be renamed. Please try again.");
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteConversation(id);
      if (selectedIdRef.current === id) handleNewChat();
      await refreshConversations();
      toast.success("Chat deleted");
    } catch (error) {
      toast.error("The chat could not be deleted. Please try again.");
      throw error;
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
        {isLoadingMessages ? (
          <Spinner className="h-full" />
        ) : (
          <ChatLayout messages={messages} isThinking={isThinking} onSend={handleSend} />
        )}
      </div>

      <ConversationSidebar
        isOpen={isSidebarOpen}
        conversations={conversationsQuery.data ?? []}
        isLoading={conversationsQuery.isLoading}
        isError={conversationsQuery.isError}
        selectedId={selectedConversationId}
        onSelect={handleSelectConversation}
        onNew={handleNewChat}
        onRename={handleRename}
        onDelete={handleDelete}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
    </section>
  );
};

export default Intellecta;
