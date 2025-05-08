const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-4 py-2">
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
    <span className="text-gray-400 ml-2">Intellecta is typing...</span>
  </div>
);

export default TypingIndicator;
