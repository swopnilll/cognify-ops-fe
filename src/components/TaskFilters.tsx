import React from "react";

import { SORT_OPTIONS, SortValue, TaskFilterState } from "../hooks/useTaskFilters";
import { KanbanStatus } from "../services/statusService";
import { TicketPriority, TicketType } from "../services/ticketService";
import { PRIORITY_OPTIONS, TYPE_OPTIONS } from "../utils/ticketMeta";
import { ProjectUser } from "../types/kanban";
import { displayNameOf } from "../hooks/useProjectTickets";
import AvatarGroup from "./ui/AvatarGroup";
import FilterSelect from "./ui/FilterSelect";
import SearchBox from "./ui/SearchBox";

interface Props {
  state: TaskFilterState;
  onChange: (changes: Partial<TaskFilterState>) => void;
  onClear: () => void;
  isFiltered: boolean;
  users: ProjectUser[];
  statuses?: KanbanStatus[]; // pass to offer a status filter (not useful on the board)
}

// Search, filters and sort order shared by the board and the list.
const TaskFilters: React.FC<Props> = ({
  state,
  onChange,
  onClear,
  isFiltered,
  users,
  statuses,
}) => {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-3 sm:mb-5">
      <SearchBox
        value={state.search}
        onChange={(search) => onChange({ search })}
        placeholder="Search tasks"
      />

      <AvatarGroup
        avatars={users.map((user) => ({
          id: user.user_id,
          src: user.picture || undefined,
          name: displayNameOf(user),
        }))}
        selectedId={state.assignee}
        onSelect={(assignee) => onChange({ assignee })}
      />

      {statuses && (
        <FilterSelect
          label="Status"
          allLabel="All statuses"
          value={state.status}
          onChange={(value) => onChange({ status: value === "" ? "" : Number(value) })}
          options={statuses.map((status) => ({ label: status.name, value: status.status_id }))}
        />
      )}

      <FilterSelect
        label="Type"
        allLabel="All types"
        value={state.type}
        onChange={(value) => onChange({ type: value as TicketType | "" })}
        options={TYPE_OPTIONS}
      />

      <FilterSelect
        label="Priority"
        allLabel="All priorities"
        value={state.priority}
        onChange={(value) => onChange({ priority: value as TicketPriority | "" })}
        options={PRIORITY_OPTIONS}
      />

      <FilterSelect
        label="Sort by"
        value={state.sort}
        onChange={(value) => onChange({ sort: value as SortValue })}
        options={SORT_OPTIONS.map((option) => ({
          label: `Sort: ${option.label}`,
          value: option.value,
        }))}
      />

      {isFiltered && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
