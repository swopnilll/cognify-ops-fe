import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react'; // Optional: lucide-react for icons

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="flex items-end w-full max-w-3xl p-2 bg-[#f4f6fc] border border-gray-300 rounded-2xl shadow-sm">
      <textarea
        ref={textareaRef}
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your question here..."
        className="flex-grow resize-none bg-transparent border-none outline-none px-3 py-2 text-gray-800 placeholder-gray-500"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <button
        onClick={handleSend}
        className="ml-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};
export default ChatInput;