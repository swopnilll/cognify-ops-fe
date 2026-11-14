import { useMemo, useState } from "react";

import {
  TicketFilters,
  TicketPriority,
  TicketSortField,
  TicketType,
} from "../services/ticketService";
import { useDebouncedValue } from "./useDebouncedValue";

export const SORT_OPTIONS = [
  { value: "created_asc", label: "Oldest first", sort: "created_at", order: "asc" },
  { value: "created_desc", label: "Newest first", sort: "created_at", order: "desc" },
  { value: "updated_desc", label: "Recently updated", sort: "updated_at", order: "desc" },
  { value: "due_asc", label: "Due date", sort: "due_date", order: "asc" },
  { value: "priority_desc", label: "Priority", sort: "priority", order: "desc" },
  { value: "name_asc", label: "Name", sort: "name", order: "asc" },
] as const satisfies readonly {
  value: string;
  label: string;
  sort: TicketSortField;
  order: "asc" | "desc";
}[];

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface TaskFilterState {
  search: string;
  assignee: string | null;
  status: number | "";
  type: TicketType | "";
  priority: TicketPriority | "";
  sort: SortValue;
}

const INITIAL: TaskFilterState = {
  search: "",
  assignee: null,
  status: "",
  type: "",
  priority: "",
  sort: "created_asc",
};

// Filter and sort choices of a task view, and the same choices in the shape
// the API expects. The search text is debounced so typing does not send a
// request per key press.
export function useTaskFilters() {
  const [state, setState] = useState<TaskFilterState>(INITIAL);
  const debouncedSearch = useDebouncedValue(state.search.trim());

  const apiFilters: TicketFilters = useMemo(() => {
    const sortOption =
      SORT_OPTIONS.find((option) => option.value === state.sort) ?? SORT_OPTIONS[0];

    return {
      q: debouncedSearch || undefined,
      assignee: state.assignee ?? undefined,
      status: state.status === "" ? undefined : state.status,
      type: state.type || undefined,
      priority: state.priority || undefined,
      sort: sortOption.sort,
      order: sortOption.order,
    };
  }, [debouncedSearch, state.assignee, state.status, state.type, state.priority, state.sort]);

  const set = (changes: Partial<TaskFilterState>) =>
    setState((previous) => ({ ...previous, ...changes }));

  const isFiltered =
    state.search.trim() !== "" ||
    state.assignee !== null ||
    state.status !== "" ||
    state.type !== "" ||
    state.priority !== "";

  // Clears the filters; the sort order is kept.
  const clear = () => setState((previous) => ({ ...INITIAL, sort: previous.sort }));

  return { state, set, clear, isFiltered, apiFilters };
}
