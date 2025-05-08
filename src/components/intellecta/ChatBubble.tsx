type Props = {
  sender: "user" | "bot";
  text: string;
};

const ChatBubble = ({ sender, text }: Props) => {
  const isUser = sender === "user";
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          px-4 py-2 rounded-2xl shadow-md max-w-[80%] whitespace-pre-wrap break-words
          ${isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white self-end"
            : "bg-gray-100 text-gray-800 self-start"
          }
          transition-all duration-200
        `}
        style={{
          borderBottomRightRadius: isUser ? "0.5rem" : "1.5rem",
          borderBottomLeftRadius: isUser ? "1.5rem" : "0.5rem",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatBubble;
