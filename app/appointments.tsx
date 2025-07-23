import { getMyAppointments } from "@/api/appointments";
import { getDependents } from "@/api/dependents";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";

interface Appointment {
  _id: string;
  date: string;
  time: string;
  status: string;
  doctor?: {
    name: string;
    specialty?: string;
    specialization?: string;
  } | null;
  patient?: {
    _id: string;
    name: string;
    email: string;
    age?: number | null;
  };
  type?: string;
  duration?: number;
  notes?: any[];
  meetLink?: string;
  calendarEventId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const {
    data: appointmentsResponse = [],  // ← Changed: expect array directly
    isLoading,
    isError,
    refetch: refetchAppointments,
  } = useQuery<Appointment[]>({  // ← Changed: expect Appointment[] directly
    queryKey: ["appointments"],
    queryFn: getMyAppointments,
  });

  console.log("APPOINTMENTS RESPONSE", appointmentsResponse);

  // Extract appointments array from the response
  const appointments = Array.isArray(appointmentsResponse) ? appointmentsResponse : [];
  console.log("ALL APPOINTMENTS", appointments);
  
  // console.log("🔍 Appointments Query State:", {
  //   appointmentsResponse,
  //   appointments,
  //   isLoading,
  //   isError,
  //   appointmentsCount: appointments?.length || 0,
  //   appointmentsType: typeof appointments,
  //   isArray: Array.isArray(appointments)
  // });
console.log("APPOINTMENTS data",appointments);
  // trying to fetch the appointments from the backend
 
  const filterAppointments = (status: string) => {
    // Ensure we have a valid array to filter
    if (!Array.isArray(appointments)) {
      console.warn("Appointments is not an array:", appointments);
      return [];
    }
    
    if (status === "upcoming") {
      return appointments.filter(app => 
        app.status?.toLowerCase() === "confirmed" || 
        app.status?.toLowerCase() === "pending"
      );
    } else if (status === "completed") {
      return appointments.filter(app => 
        app.status?.toLowerCase() === "completed"
      );
    } else if (status === "canceled") {
      return appointments.filter(app => 
        app.status?.toLowerCase() === "cancelled" || 
        app.status?.toLowerCase() === "canceled"
      );
    }
    return appointments;
  };

  // Add debugging to understand the data structure
  const filteredAppointments = filterAppointments(activeTab);

  // console.log(" Filtering Debug:", {
  //   activeTab,
  //   appointmentsResponse,
  //   appointmentsArray: appointmentsResponse?.Appointments,
  //   isArray: Array.isArray(appointmentsResponse?.Appointments),
  //   totalAppointments: appointmentsResponse?.Appointments?.length || 0,
  //   filteredCount: filteredAppointments.length,
  //   filteredAppointments: filteredAppointments
  // });

  const handleMeetLinkPress = async (meetLink: string) => {
    try {
      console.log("Opening meet link:", meetLink);
      const supported = await Linking.canOpenURL(meetLink);
      
      if (supported) {
        await Linking.openURL(meetLink);
      } else {
        console.log("Cannot open URL:", meetLink);
        Alert.alert(
          "Cannot Open Link",
          "This meeting link cannot be opened on your device.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error opening meet link:", error);
      Alert.alert(
        "Error",
        "Failed to open meeting link. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.push("/homepage")} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#588157" />
        </TouchableOpacity>
        <Text style={styles.header}>Appointments</Text>
        <TouchableOpacity 
          onPress={() => {
            console.log("🔄 Manual refetch triggered");
            refetchAppointments();
          }} 
          style={styles.refetchButton}
        >
          <Ionicons name="refresh" size={20} color="#588157" />
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text style={[styles.tabText, activeTab === "upcoming" && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text style={[styles.tabText, activeTab === "completed" && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "canceled" && styles.activeTab]}
          onPress={() => setActiveTab("canceled")}
        >
          <Text style={[styles.tabText, activeTab === "canceled" && styles.activeTabText]}>
            Canceled
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#588157" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Failed to fetch appointments.</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => refetchAppointments()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && (
        <ScrollView style={{ padding: 20, flex: 1 }}>
          {filteredAppointments.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>
                {activeTab === "upcoming" ? "Nearest visit" : 
                 activeTab === "completed" ? "Recent visits" : "Canceled visits"}
              </Text>
              
              {filteredAppointments.map((appointment) => (  // ← Use filteredAppointments
                <View key={appointment._id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.doctorInfo}>
                      <Text style={styles.doctorName}>
                        {appointment.doctor?.name ?? "No Doctor Assigned"}
                      </Text>
                      <Text style={styles.doctorSpecialty}>
                        {appointment.doctor?.specialty || appointment.doctor?.specialization || "General Practice"}
                      </Text>
                    </View>
                    <View style={styles.avatar}>
                      <Ionicons name="person" size={24} color="#588157" />
                    </View>
                  </View>
                  
                  <View style={styles.appointmentDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {new Date(appointment.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="time" size={16} color="#6b7280" />
                      <Text style={styles.detailText}>
                        {appointment.time}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <View style={[styles.statusDot, 
                        appointment.status?.toLowerCase() === 'confirmed' ? styles.statusConfirmed :
                        appointment.status?.toLowerCase() === 'pending' ? styles.statusPending :
                        appointment.status?.toLowerCase() === 'completed' ? styles.statusCompleted :
                        styles.statusCancelled
                      ]} />
                      <Text style={[styles.detailText, styles.statusText]}>
                        {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  {appointment.type && (
                    <View style={styles.appointmentType}>
                      <Text style={styles.typeText}>
                        Type: {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                      </Text>
                      {appointment.duration && (
                        <Text style={styles.durationText}>
                          Duration: {appointment.duration} min
                        </Text>
                      )}
                      {appointment.meetLink && (
                        <TouchableOpacity 
                          style={styles.meetLinkContainer}
                          onPress={() => handleMeetLinkPress(appointment?.meetLink || "")}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="videocam" size={16} color="#3b82f6" />
                          <Text style={styles.meetLinkText} numberOfLines={1}>
                            {appointment.meetLink}
                          </Text>
                          <Ionicons name="open-outline" size={16} color="#3b82f6" />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  
                  {activeTab === "upcoming" && (
                    <View style={styles.actionButtons}>
                      {/* <TouchableOpacity style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rescheduleButton} onPress={() => Linking.openURL(appointment?.meetLink ?? "")}>
                        <Text style={styles.rescheduleButtonText}>Meeting Link</Text>
                      </TouchableOpacity> */}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No {activeTab} appointments found.</Text>
              <Text style={styles.emptySubText}>Your appointments will appear here once booked.</Text>
            </View>
          )}
        </ScrollView>
      )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#588157",
    borderRadius: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b7280",
  },
  activeTabText: {
    color: "white",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
  },
  emptySubText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1f2937",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#6b7280",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  appointmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  statusConfirmed: {
    backgroundColor: "#10b981",
  },
  statusPending: {
    backgroundColor: "#f59e0b",
  },
  statusCompleted: {
    backgroundColor: "#10b981",
  },
  statusCancelled: {
    backgroundColor: "#ef4444",
  },
  statusText: {
    marginLeft: 5,
  },
  appointmentType: {
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  typeText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  durationText: {
    fontSize: 14,
    color: "#6b7280",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "bold",
  },
  rescheduleButton: {
    backgroundColor: "#588157",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rescheduleButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  refetchButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#6b7280",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#588157",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  meetLinkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    flex: 1,
    marginLeft: 6,
    marginRight: 6,
  },
  meetLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
