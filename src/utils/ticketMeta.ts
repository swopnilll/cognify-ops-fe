import { TicketPriority, TicketType } from "../services/ticketService";

export const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const TYPE_OPTIONS: { value: TicketType; label: string }[] = [
  { value: "task", label: "Task" },
  { value: "bug", label: "Bug" },
  { value: "story", label: "Story" },
];

export const priorityLabel = (priority: TicketPriority) =>
  PRIORITY_OPTIONS.find((option) => option.value === priority)?.label ?? priority;

export const typeLabel = (type: TicketType) =>
  TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;

export const PRIORITY_PILL: Record<TicketPriority, string> = {
  urgent: "bg-red-50 text-red-700 ring-red-600/20",
  high: "bg-orange-50 text-orange-700 ring-orange-600/20",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
  low: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export const TYPE_COLOR: Record<TicketType, string> = {
  task: "text-brand-600",
  bug: "text-red-600",
  story: "text-emerald-600",
};

export const isDoneStatus = (statusName: string) => {
  const key = statusName.toLowerCase();
  return key.includes("done") || key.includes("complete");
};

// Due dates are calendar days ("YYYY-MM-DD"), read in the viewer's time zone.
const toLocalDate = (day: string) => {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(year, month - 1, date);
};

export const formatDueDate = (day: string) => {
  const date = toLocalDate(day);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "numeric",
  });
};

export const isOverdue = (day: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return toLocalDate(day) < today;
};
