import axiosInstance from "../axios/axiosInstance";

export const fetchAllUsers = async () => {
    try {
        const response = await axiosInstance.get("api/projects/users/available");

        console.log("users fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}