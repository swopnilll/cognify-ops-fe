import { Bookmark, Bug, CalendarDays, SquareCheck } from "lucide-react";

import { TicketPriority, TicketType } from "../services/ticketService";
import {
  formatDueDate,
  isOverdue,
  PRIORITY_PILL,
  priorityLabel,
  TYPE_COLOR,
  typeLabel,
} from "../utils/ticketMeta";

const TYPE_ICON = { task: SquareCheck, bug: Bug, story: Bookmark };

export const TypeIcon: React.FC<{ type: TicketType; className?: string }> = ({
  type,
  className = "h-4 w-4",
}) => {
  const Icon = TYPE_ICON[type];
  return (
    <span title={typeLabel(type)} className="inline-flex shrink-0">
      <Icon aria-label={typeLabel(type)} className={`${className} ${TYPE_COLOR[type]}`} />
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => (
  <span
    className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${PRIORITY_PILL[priority]}`}
  >
    {priorityLabel(priority)}
  </span>
);

// Red when the day has passed and the task is not done.
export const DueDate: React.FC<{ day: string; isDone: boolean }> = ({ day, isDone }) => {
  const overdue = !isDone && isOverdue(day);
  return (
    <span
      title={overdue ? "Overdue" : "Due date"}
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium ${
        overdue ? "text-red-600" : "text-slate-500"
      }`}
    >
      <CalendarDays className="h-3.5 w-3.5" />
      {formatDueDate(day)}
    </span>
  );
};
