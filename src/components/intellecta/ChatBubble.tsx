type Props = {
    sender: "user" | "bot";
    text: string;
  };
  
  const ChatBubble = ({ sender, text }: Props) => {
    const isUser = sender === "user";
    return (
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg whitespace-pre-wrap ${
          isUser ? "self-end bg-blue-500 text-white" : "self-start bg-gray-200 text-gray-800"
        }`}
      >
        {text}
      </div>
    );
  };
  
  export default ChatBubble;
  