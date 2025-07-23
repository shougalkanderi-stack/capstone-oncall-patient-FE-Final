import { loginPatient, testBackendConnection } from "@/api/auth";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function LoginScreen() {
  const [civilID, setCivilID] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");

  // Test backend connection on component mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const isConnected = await testBackendConnection();
      setBackendStatus(isConnected ? "Connected ✅" : "Not Connected ❌");
    } catch (error) {
      setBackendStatus("Connection Failed ❌");
    }
  };

  const handleLogin = async () => {
    if (!civilID.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Starting login process...");
      const data = await loginPatient(civilID.trim(), password);
      console.log("Login successful:", data);
      
      // Handle different response structures
      const userName = data.user?.name || data.name || data.patient?.name || "User";
      Alert.alert("Login Successful", `Welcome ${userName}`);
      router.push("/homepage");
    } catch (err: any) {
      console.error("Login failed:", err);
      Alert.alert("Login Failed", err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text style={styles.title}>Welcome to OnCall</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>
        {/* Backend Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Backend Status:</Text>
          <Text style={[
            styles.statusText, 
            backendStatus.includes("✅") ? styles.statusSuccess : styles.statusError
          ]}>
            {backendStatus}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={checkBackendConnection}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          <TextInput 
            style={styles.input}
            placeholder="Civil ID" 
            value={civilID}
            onChangeText={setCivilID}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    padding: 20,
    paddingTop: 150,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 35,
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  statusSuccess: {
    color: "#10b981",
  },
  statusError: {
    color: "#ef4444",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  retryButtonText: {
    color: "white",
    fontSize: 12,
  },
  form: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    width: 350,
    maxWidth: "90%",
    minHeight: 400,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 18,
    marginBottom: 20,
    fontSize: 16,
    height: 55,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    height: 55,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    alignItems: "center",
  },
  registerButtonText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
