import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../constants/Colors";

const mockAppointments = [
  {
    id: "1",
    doctor: "Dr. Shahad Abdulraheem",
    type: "online",
    date: "2024-06-01",
    time: "10:30 AM",
    prescription: "Take 1 tablet of Paracetamol every 8 hours for 5 days.",
  },
  {
    id: "2",
    doctor: "Dr. Jana Alhamad",
    type: "offline",
    date: "2024-05-28",
    time: "2:00 PM",
    location: "Kuwait City Clinic, Room 12",
  },
  {
    id: "3",
    doctor: "Dr. Fatma Zamanan",
    type: "online",
    date: "2024-05-20",
    time: "4:15 PM",
    prescription: "Vitamin D supplement, 1000 IU daily.",
  },
  {
    id: "4",
    doctor: "Dr. Fatma Zamanan",
    type: "offline",
    date: "2024-05-10",
    time: "11:00 AM",
    location: "Salmiya Medical Center, 2nd Floor",
  },
];

export default function RecordsPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const handleAppointmentPress = (item: any) => {
    if (item.type === "online") {
      setModalContent({ title: "Prescription", content: item.prescription });
    } else {
      setModalContent({ title: "Location", content: item.location });
    }
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={AppColors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Previous Appointments</Text>
      </View>
      <FlatList
        data={mockAppointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.appointmentCard}
            onPress={() => handleAppointmentPress(item)}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name={item.type === "online" ? "videocam" : "location"}
                size={20}
                color={AppColors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>{item.doctor}</Text>
              <Text style={styles.type}>
                {item.type === "online" ? "Online" : "Offline"}
              </Text>
              <Text style={styles.dateTime}>
                {item.date} at {item.time}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No previous appointments found.</Text>
        }
      />
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentBox}>
            <Text style={styles.modalTitle}>{modalContent?.title}</Text>
            <Text style={styles.modalText}>{modalContent?.content}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.primary,
  },
  appointmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: AppColors.surface,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  type: {
    fontSize: 14,
    color: AppColors.primary,
    marginBottom: 2,
  },
  dateTime: {
    fontSize: 13,
    color: "#6b7280",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 32,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.primary,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: AppColors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
