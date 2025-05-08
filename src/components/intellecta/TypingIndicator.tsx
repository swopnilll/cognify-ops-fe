import { Loader2 } from "lucide-react";

const TypingIndicator = () => (
  <div className="self-start bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-1">
    <Loader2 className="w-5 h-5 animate-spin" />
    <span>Intellecta is typing...</span>
  </div>
);

export default TypingIndicator;
