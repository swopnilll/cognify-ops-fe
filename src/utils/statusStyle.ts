// Colours for a ticket status, chosen from its name so new statuses still
// get a sensible default.
export interface StatusStyle {
  dot: string;
  pill: string;
}

export const getStatusStyle = (name: string): StatusStyle => {
  const key = name.toLowerCase().replace(/\s+/g, "");

  if (key.includes("progress")) {
    return { dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700 ring-amber-600/20" };
  }
  if (key.includes("review")) {
    return { dot: "bg-violet-500", pill: "bg-violet-50 text-violet-700 ring-violet-600/20" };
  }
  if (key.includes("done") || key.includes("complete")) {
    return { dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" };
  }
  if (key.includes("todo") || key.includes("backlog")) {
    return { dot: "bg-slate-400", pill: "bg-slate-100 text-slate-700 ring-slate-500/20" };
  }
  return { dot: "bg-brand-500", pill: "bg-brand-50 text-brand-700 ring-brand-600/20" };
};
