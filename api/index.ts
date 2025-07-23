import axios from "axios";
import { CONFIG } from "../utils/config";
import { clearToken, getToken } from "./storage";

const instance = axios.create({
  baseURL: CONFIG.BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: CONFIG.API_TIMEOUT,
});

// Request interceptor to add auth token
instance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    console.error("API Response Error:", error.response?.status, error.response?.data, error.message);
    if (error.response?.status === 401) {
      // Token expired or invalid
      await clearToken();
      // You can add navigation to login here if needed
    }
    return Promise.reject(error);
  }
);

export default instance;
