import axiosInstance from "../axios/axiosInstance";

// A saved Intellecta chat. It is private to the user who started it.
export interface ConversationSummary {
  conversation_id: number;
  project_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface StoredMessage {
  message_id: number;
  conversation_id: number;
  sender: "user" | "bot";
  text: string;
  is_error: boolean;
  is_paused: boolean;
  created_at: string;
}

export interface NewMessage {
  sender: "user" | "bot";
  text: string;
  is_error?: boolean;
  is_paused?: boolean;
}

export const fetchConversations = async (projectId: number): Promise<ConversationSummary[]> => {
  const response = await axiosInstance.get<{ data: ConversationSummary[] }>(
    `api/projects/${projectId}/conversations`
  );
  return response.data.data;
};

// Starts a conversation with its first messages. The title is taken from the
// first question.
export const createConversation = async (
  projectId: number,
  messages: NewMessage[]
): Promise<ConversationSummary> => {
  const response = await axiosInstance.post<{ data: ConversationSummary }>(
    `api/projects/${projectId}/conversations`,
    { messages }
  );
  return response.data.data;
};

export const fetchConversationMessages = async (
  conversationId: number
): Promise<StoredMessage[]> => {
  const response = await axiosInstance.get<{ data: StoredMessage[] }>(
    `api/conversations/${conversationId}/messages`
  );
  return response.data.data;
};

export const addConversationMessages = async (
  conversationId: number,
  messages: NewMessage[]
): Promise<void> => {
  await axiosInstance.post(`api/conversations/${conversationId}/messages`, { messages });
};

export const renameConversation = async (
  conversationId: number,
  title: string
): Promise<ConversationSummary> => {
  const response = await axiosInstance.patch<{ data: ConversationSummary }>(
    `api/conversations/${conversationId}`,
    { title }
  );
  return response.data.data;
};

export const deleteConversation = async (conversationId: number): Promise<void> => {
  await axiosInstance.delete(`api/conversations/${conversationId}`);
};
