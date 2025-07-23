import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../../constants/Colors";

export const options = {
  headerShown: false,
};

const mockCalls = [
  {
    id: "1",
    doctor: "Dr. Shahad Abdulraheem",
    specialty: "Neurologist",
    date: "2024-06-01",
    time: "10:30 AM",
  },
  {
    id: "2",
    doctor: "Dr. Jana Alhamad",
    specialty: "Dermatologist",
    date: "2024-05-28",
    time: "2:00 PM",
  },
  {
    id: "3",
    doctor: "Dr. Fatma Zamanan",
    specialty: "Nutrition",
    date: "2024-05-20",
    time: "4:15 PM",
  },
];

export default function CallsPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={AppColors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Previous Calls</Text>
      </View>
      <FlatList
        data={mockCalls}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.callCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="call" size={20} color={AppColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>{item.doctor}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>
              <Text style={styles.dateTime}>
                {item.date} at {item.time}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No previous calls found.</Text>
        }
      />
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
  callCard: {
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
  specialty: {
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
});
