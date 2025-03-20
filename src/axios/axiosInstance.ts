import axios, { AxiosError } from "axios";

import { axiosConfig } from "./config";
import { authHeaderRequestInterceptorFunction } from "./tokenCRUD";

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use(
  authHeaderRequestInterceptorFunction,

  (error: AxiosError) => Promise.reject(error)
);

export default axiosInstance;
