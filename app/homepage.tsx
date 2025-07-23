import { Ionicons } from "@expo/vector-icons";
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
  View
} from "react-native";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getMyAppointments } from "../api/appointments";
import { getMyProfile } from "../api/auth";
import { AppColors } from "../constants/Colors";

type ActiveTab = "home" | "appointments" | "messages" | "profile";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [activeButton, setActiveButton] = useState<'book' | 'previous'>('book');

  // ✅ Fetch patient's appointments
  const {
    data: appointments = [],
    isLoading: isAppointmentsLoading,
    isError: isAppointmentsError,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: getMyAppointments,
    retry: 2,
    retryDelay: 1000,
  });

  // ✅ Fetch logged-in patient
  const {
    data: data,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    retry: 2,
    retryDelay: 1000,
  });
  console.log("profile", data);
  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
    switch (tab) {
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

  const handleRetry = () => {
    if (isProfileError) refetchProfile();
    if (isAppointmentsError) refetchAppointments();
  };

  const today = new Date().toISOString().split('T')[0];
  // Group appointments by date
  const markedDates = appointments.reduce((acc: any, appt: any) => {
    const isUpcoming = new Date(appt.date) >= new Date(today);
    acc[appt.date] = acc[appt.date] || { dots: [] };
    acc[appt.date].dots.push({
      key: appt._id,
      color: isUpcoming ? '#588157' : '#a8d5b8',
      selectedDotColor: isUpcoming ? '#588157' : '#a8d5b8',
    });
    return acc;
  }, {});
  // Filter today's upcoming appointments
  const todaysAppointments = appointments.filter(
    (appt: any) => appt.date === today && new Date(appt.date) >= new Date(today)
  );

  const renderContent = () => (
    <ScrollView contentContainerStyle={styles.content}>
      {/* 🏥 Combined Header & Welcome Card */}
      {isProfileLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#588157" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : isProfileError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile</Text>
          <Text style={styles.errorDetails}>{profileError?.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.combinedCard}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.crossSymbol}>
              <Ionicons name="person" size={40} color="#588157" />
            </View>
            <View style={styles.headerIcons}>
              <View style={styles.iconCircle}>
                <Ionicons name="heart" size={20} color="#588157" />
              </View>
              <View style={styles.iconCircle}>
                <Ionicons name="pulse" size={20} color="#588157" />
              </View>
              <View style={styles.iconCircle}>
                <Ionicons name="fitness" size={20} color="#588157" />
              </View>
            </View>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>
                Welcome back {data?.patient?.name ?? "Loading..."}
              </Text>
              <Text style={styles.subtitleText}>
                Civil ID: {data?.patient?.civilID || "N/A"}
              </Text>
            </View>
          </View>
          
          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.hospitalTitle}>Your Health, Our Priority</Text>
            </View>
          </View>
        </View>
      )}

      {/* ✅ Toggle Buttons */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            activeButton === 'book'
              ? { backgroundColor: "#588157" }
              : {
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                },
          ]}
          onPress={() => {
            setActiveButton('book');
            setTimeout(() => {
              router.push("/book-appointment");
            }, 100);
          }}
        >
          <Text
            style={[
              styles.bookButtonText,
              activeButton === 'book'
                ? { color: "#fff" }
                : { color: "#374151" },
            ]}
          >
            Book Appointment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.prevButton,
            activeButton === 'previous'
              ? { backgroundColor: "#588157", borderColor: "#588157" }
              : { backgroundColor: "#fff", borderColor: "#d1d5db" },
          ]}
          onPress={() => {
            setActiveButton('previous');
            router.push("/previous-appointments");
          }}
        >
          <Text
            style={[
              styles.prevButtonText,
              activeButton === 'previous'
                ? { color: "#fff" }
                : { color: "#374151" },
            ]}
          >
            Previous Appointments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Appointments Today */}
      <View style={[styles.appointmentsCard, { marginTop: 40, marginBottom: 20 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeText}>Today's Upcoming Appointments</Text>
          {todaysAppointments.length === 0 ? (
            <Text style={{ color: '#6b7280' }}>No upcoming appointments for today.</Text>
          ) : (
            todaysAppointments.map((appt: any) => (
              <View key={appt._id} style={{ paddingVertical: 4 }}>
                <Text style={{ fontWeight: 'bold' }}>{appt.doctorName}</Text>
                <Text>{appt.time} - {appt.type}</Text>
              </View>
            ))
          )}
        </View>
      </View>
      {/* Calendar with Appointments */}
      <View style={{ 
        maxWidth: 380, 
        alignSelf: 'center', 
        width: '100%', 
        marginTop: 20,
        marginBottom: 24, 
        borderWidth: 2, 
        borderColor: '#6B9A6F', 
        borderRadius: 12, 
        overflow: 'hidden',
        shadowColor: '#588157',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}>
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 12,
          backgroundColor: '#f0f9f4',
          zIndex: -1,
        }}>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            backgroundColor: '#e8f5e8',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }} />
        </View>
        <Calendar
          markingType={'multi-dot'}
          markedDates={markedDates}
          theme={{
            todayTextColor: '#588157',
            dotColor: '#6B9A6F',
            selectedDotColor: '#a8d5b8',
            arrowColor: '#588157',
            monthTextColor: '#222',
            textMonthFontWeight: 'bold',
            textDayFontWeight: '500',
            textDayHeaderFontWeight: '600',
          }}
        />
      </View>

      {/* 🗓️ Appointments */}
      {/* showPreviousAppointments && ( */}
        <View style={{ marginTop: 30, width: "100%", paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            Your Appointments
          </Text>
          {isAppointmentsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#588157" />
              <Text style={styles.loadingText}>Loading appointments...</Text>
            </View>
          ) : isAppointmentsError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load appointments</Text>
              <Text style={styles.errorDetails}>{appointmentsError?.message}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : appointments.length === 0 ? (
            <Text style={{ color: "#6b7280" }}>No appointments found.</Text>
          ) : (
                        appointments.map((appt: any) => (
              <View
                key={appt._id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  backgroundColor: "#fff",
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#f3f4f6",
                  shadowColor: "#588157",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700", fontSize: 18, color: "#111827", marginBottom: 4 }}>
                      {appt.doctorName}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                      <Ionicons name="calendar-outline" size={18} color="#6b7280" style={{ marginRight: 8 }} />
                      <Text style={{ color: "#6b7280", fontSize: 15, fontWeight: "500" }}>
                        {new Date(appt.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="time-outline" size={18} color="#6b7280" style={{ marginRight: 8 }} />
                      <Text style={{ color: "#6b7280", fontSize: 15, fontWeight: "500" }}>
                        {appt.time}
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    backgroundColor: "#588157",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    shadowColor: "#588157",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 2,
                  }}>
                    <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600", textTransform: "capitalize" }}>
                      {appt.type}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      {/* ) */}
    </ScrollView>
  );

  const renderTabIcon = (tabName: ActiveTab, iconName: string) => {
    const isActive = activeTab === tabName;
    return (
      <Ionicons
        name={iconName as any}
        size={24}
        color={isActive ? "#588157" : "#9ca3af"}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>{renderContent()}</View>
      <View style={styles.bottomNav}>
        <View style={styles.tabContainer}>
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
  container: { flex: 1, backgroundColor: "#f9fafb" },
  mainContent: { flex: 1 },
  content: {
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 80,
  },
  // 🏥 Combined Card Styles
  combinedCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 24,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#588157',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerSection: {
    height: 120,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  bottomSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  crossSymbol: {
    position: 'absolute',
    bottom: 10,
    left: 50,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#588157',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#f0f9f4',
  },
  headerIcons: {
    position: 'absolute',
    top: 20,
    right: 25,
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#588157',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#f0f9f4',
  },
  headerTextContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hospitalTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#588157',
    marginBottom: 4,
    fontFamily: 'SF Pro Display',
    letterSpacing: 0.8,
  },
  hospitalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  // 🎨 Decorative Elements
  decorativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#588157',
  },
  decorativeLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  welcomeSection: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeTextContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  appointmentsCard: {
    backgroundColor: "#f0f9f4",
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#588157",
    padding: 16,
    marginVertical: 16,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#588157",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
    fontFamily: "SF Pro Text",
    letterSpacing: 0.3,
  },
  subtitleText: {
    fontSize: 14,
    color: "#555",
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#588157",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f9f4",
    marginLeft: 12,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6b7280",
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#588157",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomNav: {
    backgroundColor: "white",
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
  tab: { alignItems: "center", paddingVertical: 8, paddingHorizontal: 12 },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
    color: "#9ca3af",
  },
  activeTabText: { color: "#588157" },
  bookButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  bookButtonText: { fontSize: 14, fontWeight: "600" },
  prevButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  prevButtonText: { fontSize: 14, fontWeight: "600" },
});
