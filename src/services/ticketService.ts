import axiosInstance from "../axios/axiosInstance";

// Types
export interface TicketData {
  name: string;
  description: string;
  project_id: number;
  created_by: string;
  status_id: number;
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
  projectId: number
): Promise<ProjectTicket[]> => {
  try {
    const response = await axiosInstance.get<GetTicketsByProjectResponse>(
      `api/tickets/project/${projectId}`
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