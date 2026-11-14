// An empty string means "same origin": the API is served under /api by the
// same reverse proxy that serves this app.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const ACCESS_TOKEN_KEY = "access_token";

export const axiosConfig = {
  // "/" keeps relative request paths anchored to the site root when the API
  // is on the same origin.
  baseURL: API_BASE_URL || "/",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
