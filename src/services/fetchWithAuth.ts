import { API_BASE_URL, axiosConfig } from "../axios/config";
import { getAccessToken } from "../axios/tokenCRUD";

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAccessToken();

  const headers: HeadersInit = {
    ...axiosConfig.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};
