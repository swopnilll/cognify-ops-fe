import { InternalAxiosRequestConfig } from "axios";

import { ACCESS_TOKEN_KEY } from "./config";

// Function to get access token from localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Function to set access token in localStorage
export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

// TODO: Replace with actual token validation logic (Refresh token)
export const setUserDetails = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserDetails = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Function to clear access token on logout
export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const authHeaderRequestInterceptorFunction = (
  config: InternalAxiosRequestConfig
) => {
  const token = getAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};
