import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../constants/Colors";

type ActiveTab = "home" | "appointments" | "messages" | "profile";
type MessageMode = "doctors" | "ai";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Shahad Abdulraheem",
    specialty: "Neurologist",
    lastMessage: "Your test results look good. Let's schedule a follow-up.",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Dr. Jana Alhamad",
    specialty: "Dermatologist",
    lastMessage: "Please apply the prescribed cream twice daily.",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "3",
    name: "Dr. Shoug Alkanderi",
    specialty: "Physical Thyerapy ",
    lastMessage: "Here are some exercises for you to try! ",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: "4",
    name: "Dr. Fatma Zamanan",
    specialty: "Cardiologist",
    lastMessage: "Your heart health is improving. Continue with the medication.",
    lastMessageTime: "3 hours ago",
    unreadCount: 0,
    isOnline: true,
  },
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("messages");
  const [messageMode, setMessageMode] = useState<MessageMode>("doctors");
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        router.push("/home");
        break;
      case "appointments":
        router.push("/appointments");
        break;
      case "messages":
        // Stay on current page
        break;
      case "profile":
        router.push("/profile");
        break;
    }
  };

  const handleDoctorChat = (doctorId: string) => {
    router.push({
      pathname: "/messages/chat/[doctorId]",
      params: { doctorId },
    });
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "image/*",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled) {
        setUploadedFile(result);
      }
    } catch (e) {
      Alert.alert("Error", "Could not open document picker.");
    }
  };

  const renderTabIcon = (tabName: ActiveTab, iconName: string) => {
    const isActive = activeTab === tabName;
    return (
      <Ionicons
        name={iconName as any}
        size={24}
        color={isActive ? AppColors.primary : "#9ca3af"}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => router.push("/messages/calls")}
        >
          <Ionicons name="call" size={22} color="#5A9A61" />
        </TouchableOpacity>
      </View>

      {/* Toggle Switch */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              messageMode === "doctors" && styles.toggleButtonActive,
            ]}
            onPress={() => setMessageMode("doctors")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                messageMode === "doctors" && styles.toggleTextActive,
              ]}
            >
              Doctors
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              messageMode === "ai" && styles.toggleButtonActive,
            ]}
            onPress={() => setMessageMode("ai")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                messageMode === "ai" && styles.toggleTextActive,
              ]}
            >
              AI Assistant
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentArea}>
        {messageMode === "doctors" ? (
          <FlatList
            data={doctors}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.doctorCard}
                onPress={() => handleDoctorChat(item.id)}
              >
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarCircle}>
                    <Ionicons
                      name="person"
                      size={24}
                      color="#5A9A61"
                    />
                  </View>
                  {item.isOnline && <View style={styles.onlineDot} />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.doctorRow}>
                    <Text style={styles.doctorName}>{item.name}</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {item.lastMessageTime && (
                        <Text style={styles.lastMessageTime}>
                          {item.lastMessageTime}
                        </Text>
                      )}
                      {item.unreadCount && item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadBadgeText}>
                            {item.unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                  {item.lastMessage && (
                    <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.aiContainer}>
            {!uploadedFile ? (
              <View style={{ alignItems: "center" }}>
                <View style={styles.aiIconCircle}>
                  <Ionicons
                    name="document-text-outline"
                    size={40}
                    color="#5A9A61"
                  />
                </View>
                <Text style={styles.aiTitle}>AI Medical Analysis</Text>
                <Text style={styles.aiSubtitle}>
                  Upload your medical report for analysis
                </Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUpload}
                >
                  <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text style={styles.aiTitle}>Uploaded Document</Text>
                <Text style={styles.uploadedFileName}>{uploadedFile.name}</Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUpload}
                >
                  <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.tabContainer}>
          {/* Home */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("home")}
          >
            {renderTabIcon("home", "home")}
            <Text
              style={[
                styles.tabText,
                activeTab === "home" && styles.activeTabText,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Appointments */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("appointments")}
          >
            {renderTabIcon("appointments", "calendar")}
            <Text
              style={[
                styles.tabText,
                activeTab === "appointments" && styles.activeTabText,
              ]}
            >
              Appointments
            </Text>
          </TouchableOpacity>

          {/* Messages */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("messages")}
          >
            {renderTabIcon("messages", "chatbubble")}
            <Text
              style={[
                styles.tabText,
                activeTab === "messages" && styles.activeTabText,
              ]}
            >
              Messages
            </Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("profile")}
          >
            {renderTabIcon("profile", "person")}
            <Text
              style={[
                styles.tabText,
                activeTab === "profile" && styles.activeTabText,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  callButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#5A9A61",
    shadowColor: "#5A9A61",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    color: "#64748b",
    fontWeight: "500",
    fontSize: 14,
  },
  toggleTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  doctorCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarWrapper: {
    marginRight: 16,
    position: "relative",
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e0f2fe",
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#5A9A61",
    borderWidth: 2.5,
    borderColor: "#ffffff",
  },
  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  doctorName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1f2937",
    flex: 1,
    marginBottom: 2,
  },
  lastMessageTime: {
    color: "#94a3b8",
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "500",
  },
  unreadBadge: {
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 11,
  },
  doctorSpecialty: {
    color: "#5A9A61",
    fontSize: 13,
    marginTop: 2,
    marginBottom: 4,
    fontWeight: "500",
  },
  lastMessage: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 2,
    lineHeight: 18,
  },
  aiContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    backgroundColor: "#fafafa",
  },
  aiIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#e0f2fe",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  aiSubtitle: {
    color: "#64748b",
    fontSize: 15,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  uploadButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5A9A61",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#5A9A61",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  uploadedFileName: {
    color: "#1f2937",
    fontSize: 15,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  bottomNav: {
    backgroundColor: "#ffffff",
    borderTopWidth: 0.5,
    borderTopColor: "#f1f5f9",
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    maxWidth: 400,
    alignSelf: "center",
  },
  tab: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
    color: "#9ca3af",
  },
  activeTabText: {
    color: AppColors.primary,
  },
  aiCard: {
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.84,
    elevation: 8,
  },
});
