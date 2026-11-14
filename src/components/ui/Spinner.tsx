const Spinner = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center py-16 ${className}`}>
    <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
  </div>
);

export default Spinner;
