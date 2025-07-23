import { registerPatient } from "@/api/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    civilID: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'civilID', 'password'];
    const missingFields = requiredFields.filter(field => !form[field as keyof typeof form].trim());
    
    if (missingFields.length > 0) {
      Alert.alert("Error", `Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Starting registration process...");
      await registerPatient(form);
      console.log("Registration successful");
      Alert.alert("Success", "Registration completed successfully! You can now login.", [
        {
          text: "OK",
          onPress: () => router.push("/login")
        }
      ]);
    } catch (error: any) {
      console.error("Registration failed:", error);
      Alert.alert("Error", error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.centerContent}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Please fill in your details to register</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={form.name}
            onChangeText={(value) => handleInputChange("name", value)}
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address *"
            value={form.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            value={form.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            keyboardType="phone-pad"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Civil ID *"
            value={form.civilID}
            onChangeText={(value) => handleInputChange("civilID", value)}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password *"
            value={form.password}
            secureTextEntry
            onChangeText={(value) => handleInputChange("password", value)}
            editable={!isLoading}
          />
          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleBackToLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  centerContent: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  form: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    width: "100%",
    maxWidth: 350,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    fontSize: 16,
    height: 55,
  },
  registerButton: {
    backgroundColor: "#588157",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    height: 55,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    alignItems: "center",
  },
  loginButtonText: {
    color: "#588157",
    fontSize: 14,
  },
});
