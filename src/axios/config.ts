console.log(import.meta.env.VITE_API_BASE_URL);

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:5000";

export const ACCESS_TOKEN_KEY = "access_token";

export const axiosConfig = {
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
