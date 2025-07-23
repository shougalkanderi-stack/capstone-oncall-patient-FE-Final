import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../constants/Colors";
import { useFavourites } from "./_layout";

type ActiveTab = "home" | "appointments" | "messages" | "profile";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  type: string;
  time: string;
  date: string;
}

interface PreviousAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  type: string;
  time: string;
  date: string;
  isFavourite: boolean;
  rating: number;
}

// Accept favouriteDoctors as a prop for now (to be synced with appointments page)
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [showPreviousAppointments, setShowPreviousAppointments] =
    useState(false);
  const { favouriteDoctors, toggleFavourite } = useFavourites();

  // Mock previous appointments data - sync with global favorites
  const [previousAppointments, setPreviousAppointments] = useState<
    PreviousAppointment[]
  >([
    {
      id: "1",
      doctorId: "1",
      doctorName: "Dr. Shoug alkanderi",
      specialty: "Physical therapy",
      type: "Physical Therapy Session",
      time: "10:00 AM",
      date: "2024-01-15",
      isFavourite: favouriteDoctors.some((d) => d.id === "1"),
      rating: 0,
    },
    {
      id: "2",
      doctorId: "2",
      doctorName: "Dr. Jana Alhamad",
      specialty: "Dermatologist",
      type: "Skin Consultation",
      time: "2:30 PM",
      date: "2024-01-10",
      isFavourite: favouriteDoctors.some((d) => d.id === "2"),
      rating: 5,
    },
    {
      id: "3",
      doctorId: "3",
      doctorName: "Dr. Fatma Zamanan",
      specialty: "Internal medicine doctor",
      type: "General Checkup",
      time: "9:00 AM",
      date: "2024-01-05",
      isFavourite: favouriteDoctors.some((d) => d.id === "3"),
      rating: 4,
    },
  ]);

  // Mock user data
  const userName = "Dalal";

  // Mock appointment data - set to null to show "no upcoming appointments"
  const nextAppointment: Appointment | null = {
    id: "1",
    doctorName: "Dr. Evelyn Reed",
    type: "General Checkup",
    time: "10:00 AM",
    date: "Today",
  };

  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        break;
      case "appointments":
        router.push("/appointments");
        break;
      case "messages":
        router.push("/messages");
        break;
      case "profile":
        router.push("/profile");
        break;
    }
  };

  const handleBookAppointment = () => {
    router.push("/appointments");
  };

  const handleToggleFavourite = (appointment: PreviousAppointment) => {
    // Convert appointment to Doctor format and use global favorites
    const doctor: Doctor = {
      id: appointment.doctorId,
      name: appointment.doctorName,
      specialty: appointment.specialty,
      image: "", // We don't have image in appointment data
    };

    toggleFavourite(doctor);

    // Update local state to reflect the change
    setPreviousAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointment.id
          ? { ...apt, isFavourite: !apt.isFavourite }
          : apt
      )
    );
  };

  const handleRating = (appointmentId: string, rating: number) => {
    setPreviousAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, rating }
          : appointment
      )
    );
  };

  // Sync previous appointments with global favorites
  useEffect(() => {
    setPreviousAppointments((prev) =>
      prev.map((appointment) => ({
        ...appointment,
        isFavourite: favouriteDoctors.some(
          (d) => d.id === appointment.doctorId
        ),
      }))
    );
  }, [favouriteDoctors]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with avatar and welcome text in a row */}
      <View style={styles.headerRow}>
        <View style={styles.avatarLarge}>
          <Ionicons name="person" size={24} color="#568065" />
        </View>
        <Text style={styles.welcomeTextRow}>Welcome back, {userName}</Text>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Next Appointment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
          {nextAppointment ? (
            <View style={styles.nextAppointmentCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.appointmentDoctor}>
                  {nextAppointment.doctorName}
                </Text>
                <Text style={styles.appointmentDetails}>
                  {nextAppointment.type} · {nextAppointment.time}
                </Text>
              </View>
              <View style={styles.nextDoctorImageWrapper}>
                <View style={styles.nextDoctorAvatarPlaceholder}>
                  <Ionicons name="person" size={24} color="#568065" />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noAppointmentCard}>
              <Text style={styles.noAppointmentText}>
                No upcoming appointments
              </Text>
            </View>
          )}
        </View>

        {/* Quick Access Section */}
        <View style={styles.quickAccessRow}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              !showPreviousAppointments && { backgroundColor: "#6d9c7a" },
            ]}
            onPress={() => {
              setShowPreviousAppointments(false);
              setTimeout(() => handleBookAppointment(), 100); // Allow time for state to update
            }}
          >
            <Text
              style={[
                styles.bookButtonText,
                !showPreviousAppointments && { color: "#fff" },
              ]}
            >
              Book Appointment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.viewRecordsButton,
              showPreviousAppointments && {
                backgroundColor: "#6d9c7a",
                borderColor: "#6d9c7a",
              },
            ]}
            onPress={() => setShowPreviousAppointments(true)}
          >
            <Text
              style={[
                styles.viewRecordsText,
                showPreviousAppointments && { color: "#fff" },
              ]}
            >
              Previous Appointments
            </Text>
          </TouchableOpacity>
        </View>

        {/* Favourite Doctors Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favourite Doctors</Text>
          {favouriteDoctors.length === 0 ? (
            <Text style={styles.noFavouritesText}>No favourite doctors</Text>
          ) : (
            favouriteDoctors.map((doctor) => (
              <View key={doctor.id} style={styles.doctorCard}>
                <View style={styles.doctorInfo}>
                  <View style={styles.doctorAvatar}>
                    <Ionicons
                      name="person"
                      size={24}
                      color="#568065"
                    />
                    <View style={styles.favouriteIndicator}>
                      <Ionicons name="heart" size={12} color="#FF6B6B" />
                    </View>
                  </View>
                  <View style={styles.doctorDetails}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>
                      {doctor.specialty}
                    </Text>
                  </View>
                </View>
                <View style={styles.favDoctorActions}>
                  <TouchableOpacity
                    style={styles.favDoctorButton}
                    onPress={() =>
                      router.push({
                        pathname: "/messages/chat/[doctorId]",
                        params: { doctorId: doctor.id },
                      })
                    }
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={18}
                      color={AppColors.primary}
                    />
                    <Text style={styles.favDoctorButtonText}>Chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.favDoctorButton}
                    onPress={() =>
                      router.push({
                        pathname: "/appointments",
                        params: { doctorId: doctor.id },
                      })
                    }
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={AppColors.primary}
                    />
                    <Text style={styles.favDoctorButtonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Previous Appointments Modal */}
      <Modal
        visible={showPreviousAppointments}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackButton}
              onPress={() => setShowPreviousAppointments(false)}
            >
              <Ionicons name="arrow-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Previous Appointments</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>

          {/* Modal Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {previousAppointments.length === 0 ? (
              <View style={styles.noAppointmentsContainer}>
                <Text style={styles.noAppointmentsText}>
                  No previous appointments
                </Text>
              </View>
            ) : (
              previousAppointments.map((appointment) => (
                <View
                  key={appointment.id}
                  style={styles.previousAppointmentCard}
                >
                  <View style={styles.appointmentHeader}>
                    <View style={styles.doctorInfo}>
                      <View style={styles.doctorAvatar}>
                        <Ionicons
                          name="person"
                          size={24}
                          color="#568065"
                        />
                      </View>
                      <View style={styles.doctorDetails}>
                        <Text style={styles.doctorName}>
                          {appointment.doctorName}
                        </Text>
                        <Text style={styles.doctorSpecialty}>
                          {appointment.specialty}
                        </Text>
                        <Text style={styles.appointmentDate}>
                          {appointment.date} · {appointment.time}
                        </Text>
                        <Text style={styles.appointmentType}>
                          {appointment.type}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.favouriteButton}
                      onPress={() => handleToggleFavourite(appointment)}
                    >
                      <Ionicons
                        name={
                          appointment.isFavourite ? "heart" : "heart-outline"
                        }
                        size={24}
                        color={appointment.isFavourite ? "#FF6B6B" : "#9ca3af"}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Rating Section */}
                  <View style={styles.ratingSection}>
                    <Text style={styles.ratingLabel}>
                      Rate your experience:
                    </Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          style={styles.starButton}
                          onPress={() => handleRating(appointment.id, star)}
                        >
                          <Ionicons
                            name={
                              appointment.rating >= star
                                ? "star"
                                : "star-outline"
                            }
                            size={20}
                            color={
                              appointment.rating >= star ? "#FFD700" : "#9ca3af"
                            }
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.tabContainer}>
          {/* Home */}
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabPress("home")}
          >
            <Ionicons
              name="home"
              size={24}
              color={activeTab === "home" ? AppColors.primary : "#9ca3af"}
            />
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
            <Ionicons
              name="calendar"
              size={24}
              color={
                activeTab === "appointments" ? AppColors.primary : "#9ca3af"
              }
            />
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
            <Ionicons
              name="chatbubble"
              size={24}
              color={activeTab === "messages" ? AppColors.primary : "#9ca3af"}
            />
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
            <Ionicons
              name="person"
              size={24}
              color={activeTab === "profile" ? AppColors.primary : "#9ca3af"}
            />
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
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  avatarLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: AppColors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeTextRow: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 10,
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: AppColors.background,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  appointmentCard: {
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
  },
  appointmentDoctor: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
    marginBottom: 2,
  },
  appointmentDetails: {
    color: "#374151",
    fontSize: 13,
  },
  doctorImageWrapper: {
    width: 56,
    height: 56,
    backgroundColor: AppColors.secondary,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  doctorAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  doctorImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  noAppointmentCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  noAppointmentText: {
    color: "#6b7280",
    fontSize: 14,
  },
  quickAccessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookButton: {
    flex: 1,
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  viewRecordsButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  viewRecordsText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
  noFavouritesText: {
    color: "#6b7280",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
  },
  doctorCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  favouriteIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#6b7280",
  },
  bottomNav: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  favDoctorActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 12,
  },
  favDoctorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  favDoctorButtonText: {
    color: AppColors.primary,
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalBackButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  modalHeaderSpacer: {
    width: 28,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  previousAppointmentCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  favouriteButton: {
    padding: 4,
  },
  ratingSection: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  starButton: {
    padding: 2,
  },
  appointmentDate: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  appointmentType: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    marginTop: 4,
  },
  nextAppointmentCard: {
    backgroundColor: '#eaf7ef',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8bb2a3',
    shadowColor: '#8bb2a3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  nextDoctorImageWrapper: {
    width: 56,
    height: 56,
    backgroundColor: '#eaf7ef',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    borderWidth: 3,
    borderColor: '#8bb2a3',
  },
  nextDoctorAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8bb2a3',
  },
});
