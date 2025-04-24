import axiosInstance from "../axios/axiosInstance";

type CreateProjectParams = {
    userId: string;
    name: string;
    description?: string;
    project_key: string;
}

export const fetchProjectsForUser = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/api/projects/${userId}`);

        console.log("Projects fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
}

export const createProject = async (projectData: CreateProjectParams) => {
    try {
        const projectPayload = {
            user_id: projectData.userId,
            name: projectData.name,
            description: projectData?.description || "",
            project_key: projectData.project_key,
        }

        const response = await axiosInstance.post("/api/projects", projectPayload);

        console.log("Project created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
}



