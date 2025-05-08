import React from "react";

export type Message = {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  date: string;
  messages: Message[];
};

type Props = {
  isOpen: boolean;
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggle: () => void;
};

const ConversationSidebar: React.FC<Props> = ({
  isOpen,
  conversations,
  selectedId,
  onSelect,
  onToggle,
}) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out h-full ${
        isOpen ? "w-64" : "w-0"
      } bg-white shadow-md border-l border-gray-200 overflow-hidden`}
    >
      {isOpen && (
        <div className="flex flex-col h-fit">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <p className="font-semibold text-lg">Chats</p>
            <button
              onClick={onToggle}
              className="text-blue-600 text-sm hover:underline"
            >
              Hide
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b">
            <button
              onClick={() => onSelect("new")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              + New Chat
            </button>
          </div>

          {/* List of conversations */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No conversations yet.</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={`cursor-pointer truncate p-2 rounded hover:bg-blue-100 ${
                    selectedId === conv.id
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  {conv.date}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationSidebar;
