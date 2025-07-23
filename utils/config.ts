// Configuration file for backend settings
export const CONFIG = {
  // Update this to match your backend URL
  BACKEND_URL: "http://localhost:5000", // Your backend base URL
  
  // API timeout in milliseconds
  API_TIMEOUT: 10000,
  
  // App settings
  APP_NAME: "OnCall",
  
  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: "token",
    USER_PROFILE: "user_profile",
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${CONFIG.BACKEND_URL}${endpoint}`;
}; 