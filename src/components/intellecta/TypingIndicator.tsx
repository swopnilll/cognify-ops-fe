const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-1 py-2" aria-label="Intellecta is thinking">
    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
  </div>
);

export default TypingIndicator;
