import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { getPatientBookings } from "@/api/bookings";
import { AppColors } from "@/constants/Colors";
import { getAllProviders } from "@/api/providers";

export default function PreviousAppointmentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("completed");

  // Fetch patient's appointments
  const {
    data: appointments,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: getPatientBookings,
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const filterAppointments = (status: string) => {
    if (!Array.isArray(appointments)) return [];
    
    if (status === "completed") {
      return appointments.filter((appointment: any) => 
        appointment.status?.toLowerCase() === 'completed'
      );
    } else if (status === "canceled") {
      return appointments.filter((appointment: any) => 
        appointment.status?.toLowerCase() === 'cancelled' || 
        appointment.status?.toLowerCase() === 'canceled'
      );
    }
    return appointments;
  };

  const filteredAppointments = filterAppointments(activeTab);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Previous Appointments</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#809671" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Previous Appointments</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Failed to load appointments</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => {
            console.log('Back button pressed');
            router.back();
          }} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#809671" />
        </TouchableOpacity>
        <Text style={styles.header}>Previous Appointments</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
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

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No {activeTab} appointments</Text>
            <Text style={styles.emptySubtitle}>
              You don't have any {activeTab} appointments yet.
            </Text>
          </View>
        ) : (
          <View style={styles.appointmentsList}>
            <Text style={styles.sectionTitle}>
              {activeTab === "completed" ? "Recent visits" : "Canceled visits"}
            </Text>
            
            {filteredAppointments.map((appointment: any) => (
              <View key={appointment.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>
                      {appointment.doctor?.fullName || appointment.doctorName || 'Dr. Unknown'}
                    </Text>
                    <Text style={styles.doctorSpecialty}>
                      {appointment.doctor?.specialty || appointment.specialty || 'General Medicine'}
                    </Text>
                  </View>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={24} color="#809671" />
                  </View>
                </View>
                
                <View style={styles.appointmentDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {formatDate(appointment.date || appointment.appointmentDate)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>
                      {formatTime(appointment.time || appointment.appointmentTime)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <View style={styles.statusDot} />
                    <Text style={styles.detailText}>
                      {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1) || 'Unknown'}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: 90,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#809671',
    borderRadius: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#809671',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  appointmentsList: {
    gap: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1f2937',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#6b7280',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rescheduleButton: {
    backgroundColor: '#809671',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  rescheduleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 