// api/auth.ts
import instance from ".";
import { PatientInfo } from "../types/PatientInfo";
import { clearToken, saveToken } from "./storage";

// Test backend connection
export const testBackendConnection = async () => {
  try {
    console.log("Testing backend connection...");
    const response = await fetch("http://localhost:5000/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Backend health check response:", response.status, response.statusText);
    return response.ok;
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return false;
  }
};

// Login Patient
export const loginPatient = async (civilID: string, password: string) => {
  try {
    console.log("Attempting login with:", { civilID, password: "***" });
    console.log("Backend URL:", instance.defaults.baseURL);
    console.log("Full login URL:", `${instance.defaults.baseURL}/auth/login`);
    
    const { data } = await instance.post("/auth/login", { civilID, password });
    console.log("Login response:", data);
    
    // Handle different response structures
    if (data.token) {
      await saveToken("token", data.token);
    } else if (data.accessToken) {
      await saveToken("token", data.accessToken);
    }
    
    return data;
  } catch (error: any) {
    console.error("Login error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      }
    });
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "Login failed";
    throw new Error(errorMessage);
  }
};

// Register Patient
export const registerPatient = async (patient: PatientInfo) => {
  try {
    console.log("Attempting registration with:", { ...patient, password: "***" });
    console.log("Full register URL:", `${instance.defaults.baseURL}/auth/register`);
    
    const { data } = await instance.post("/auth/register", {
      ...patient,
      role: "Patient",
    });
    console.log("Registration response:", data);
    return data;
  } catch (error: any) {
    console.error("Registration error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      }
    });
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "Registration failed";
    throw new Error(errorMessage);
  }
};

// Get Logged-in Patient Profile (temporary - you'll need to implement this endpoint)
export const getMyProfile = async () => {
  try {
    console.log("Note: /auth/me endpoint not implemented yet");
    const { data } = await instance.get("/auth/me");
    console.log("Profile response:", data);
    return data;
    // For now, return a mock profile until you implement this endpoint
    // return {
    //   name: data.name,
    //   email: data.email,
    //   phone: data.phone,
    //   civilID: data.civilID,
    //   createdAt: new Date().toISOString(),
    // };
  } catch (error: any) {
    console.error("Get profile error:", error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "Failed to fetch profile";
    throw new Error(errorMessage);
  }
};

// Logout Patient
export const logoutPatient = async () => {
  try {
    await instance.post("/auth/logout");
  } catch (error) {
    // Even if logout fails on server, clear local token
    console.log("Logout error:", error);
  } finally {
    await clearToken();
  }
};

// Update Patient Profile
export const updatePatientProfile = async (updates: Partial<PatientInfo>) => {
  try {
    const { data } = await instance.put("/auth/profile", updates);
    return data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        "Failed to update profile";
    throw new Error(errorMessage);
  }
};
