import axiosInstance from "../axios/axiosInstance";

export interface KanbanStatus {
    status_id: number;
    name: string;
  }

export const fetchAllStatuses = async (): Promise<KanbanStatus[]> => {
    try {
        const response = await axiosInstance.get("api/status");

        console.log("status fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching status:", error);
        throw error;
    }
}