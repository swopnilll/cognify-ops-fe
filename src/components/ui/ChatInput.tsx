import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onContextQuery:(message:string)=>void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onContextQuery}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };
const handleContextSend=()=>{
  if (message.trim()) {
    onContextQuery(message.trim());
    setMessage("");
  }
}

  return (
    <div className="flex items-end bg-white border border-gray-200 rounded-2xl shadow-sm px-3 py-2 gap-2 transition focus-within:border-blue-400">
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow resize-none bg-transparent border-none outline-none px-1 py-1 text-gray-900 placeholder-gray-400 text-base"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        autoFocus
      />
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className={`p-2 rounded-full transition-colors ${
          message.trim()
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
      <button
        onClick={handleContextSend}
        disabled={!message.trim()}
        className={`p-2 rounded-full transition-colors ${
          message.trim()
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
        aria-label="Send message"
      >
        Context Search
      
      </button>
    </div>
  );
};

export default ChatInput;
