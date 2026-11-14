import axiosInstance from "../axios/axiosInstance";

// Types
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketType = "task" | "bug" | "story";
export type TicketSortField = "created_at" | "updated_at" | "due_date" | "priority" | "name";

export interface TicketData {
  name: string;
  description: string;
  project_id: number;
  created_by: string;
  status_id: number;
  priority?: TicketPriority;
  type?: TicketType;
  due_date?: string | null; // "YYYY-MM-DD" or a full ISO date
}

// Fields PATCH api/tickets/:id accepts. Leave a field out to keep it as it is.
export interface UpdateTicketPayload {
  name?: string;
  description?: string | null;
  priority?: TicketPriority;
  type?: TicketType;
  due_date?: string | null; // null clears it
}

// Query-string filters of GET api/tickets/project/:projectId
export interface TicketFilters {
  status?: number;
  assignee?: string;
  priority?: TicketPriority;
  type?: TicketType;
  q?: string; // searches name and description
  sort?: TicketSortField;
  order?: "asc" | "desc";
}

export interface CreateTicketPayload {
  ticketData: TicketData;
  userId: string;
}

export interface Ticket {
  ticket_id: number;
  name: string;
  description: string;
  project_id: number;
  created_by: string;
  status_id: number;
  priority: TicketPriority;
  type: TicketType;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  ticket_id: number;
  user_id: string;
}

export interface CreateTicketResponse {
  message: string;
  data: {
    ticket: Ticket;
    assignment: Assignment;
  };
}

export interface TicketAssignment {
  ticket_id: number;
  user_id: string;
}

export interface ProjectTicket extends Ticket {
  Ticket_Assignment: TicketAssignment[];
}

export interface GetTicketsByProjectResponse {
  data: ProjectTicket[];
}

// Service Function
export const createTicket = async (
  payload: CreateTicketPayload
): Promise<CreateTicketResponse> => {

  console.log("Create Ticket Called");

  console.log(payload)

  try {
    const response = await axiosInstance.post<CreateTicketResponse>(
      "api/tickets",
      payload
    );

    console.log("Ticket created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const fetchTicketsByProjectId = async (
  projectId: number,
  filters: TicketFilters = {}
): Promise<ProjectTicket[]> => {
  try {
    const response = await axiosInstance.get<GetTicketsByProjectResponse>(
      `api/tickets/project/${projectId}`,
      { params: filters } // undefined values are left out
    );

    console.log("Tickets fetched for project:", response.data);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching tickets for project ${projectId}:`, error);
    throw error;
  }
};

export interface GetSingleTicketResponse {
  data: Ticket;
}

export const fetchTicketById = async (
  ticketId: number
): Promise<GetSingleTicketResponse> => {
  try {
    const response = await axiosInstance.get<GetSingleTicketResponse>(
      `api/tickets/${ticketId}`
    );

    console.log(`Ticket ${ticketId} fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket with ID ${ticketId}:`, error);
    throw error;
  }
};

export const updateTicketStatus = async (
  ticketId: number,
  statusId: number
): Promise<void> => {
  try {
    const response = await axiosInstance.patch(
      `api/tickets/${ticketId}/status`, 
      { statusId } 
    );

    console.log(`Ticket ${ticketId} status updated successfully:`, response.data);
  } catch (error) {
    console.error(`Error updating ticket ${ticketId} status:`, error);
    throw error;
  }
};
export const updateTicket = async (
  ticketId: number,
  changes: UpdateTicketPayload
): Promise<ProjectTicket> => {
  try {
    const response = await axiosInstance.patch<{ data: ProjectTicket }>(
      `api/tickets/${ticketId}`,
      changes
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating ticket ${ticketId}:`, error);
    throw error;
  }
};

export const updateTicketAssignee = async (
  ticketId: number,
  userId: string
): Promise<void> => {
  try {
    await axiosInstance.patch(`api/tickets/${ticketId}/assign`, { userId });
  } catch (error) {
    console.error(`Error reassigning ticket ${ticketId}:`, error);
    throw error;
  }
};

export const deleteTicket = async (ticketId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`api/tickets/${ticketId}`);
  } catch (error) {
    console.error(`Error deleting ticket ${ticketId}:`, error);
    throw error;
  }
};
