import { bookAppointment } from "@/api/appointments";
import { router } from "expo-router";
import React, { useState } from "react";
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from "react-native";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AppColors } from "../constants/Colors";
import { getAllProviders } from "@/api/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

export default function BookAppointmentScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [providerType, setProviderType] = useState("Doctor");
  const [specialization, setSpecialization] = useState("");
  const [mode, setMode] = useState("online");
  const [duration, setDuration] = useState("");

  const [bookingData, setBookingData] = useState({
    doctorID: "",
    date: "",
    time: "",
    type: "online",
    duration: 0
  });
  console.log("Dummy Data for appointment:", bookingData)
// fetch all doctors to display
// const {
//   data: data,
//   isLoading: isProviderLoading,
//   isError: isProviderError,
//   refetch: refetchProvider,
// } = useQuery({
//   queryKey: ["providers"],
//   queryFn: getAllProviders,
// });

// console.log("provider list:", data)

  // Fetch all providers
  const { data: providers = [], isLoading: isProvidersLoading, refetch: refetchProviders } = useQuery({
    queryKey: ["providers"],
    queryFn: getAllProviders,
  });

  console.log("Providers fetched:", providers);
  console.log("Selected doctorId:", bookingData.doctorID);
  console.log("Current bookingData:", bookingData);
  
  // Debug: Show selected doctor details
  const selectedDoctor = providers.find((p: any) => p._id === bookingData.doctorID);
  console.log("Selected doctor details:", selectedDoctor);
  console.log("All provider IDs:", providers.map((p: any) => ({ id: p._id, name: p.name, role: p.role })));
  
  // Debug: Check if providers have the expected structure
  if (providers.length > 0) {
    console.log("First provider structure:", providers[0]);
    console.log("Provider keys:", Object.keys(providers[0]));
  }
// create appointment 
const {
  mutate
} = useMutation({
  mutationKey: ["creatAppointment"],
  mutationFn: bookAppointment,
  onSuccess: (data) => {
    console.log("Booking successful:", data);
    Alert.alert("Success", "Appointment booked successfully!", [
      { text: "OK", onPress: () => router.push("/homepage") }
    ]);
  },
  onError: (error) => {
    console.error("Booking failed:", error);
    Alert.alert("Error", error.message || "Failed to book appointment. Please try again.");
  }
});

// In your handler:
const handleBookAppointment = () => {
  const bookingPayload = {
    doctorID: bookingData.doctorID,
    date: new Date(bookingData.date), // Convert string to Date object
    time: bookingData.time, // Convert string to number
    type: bookingData.type,
    duration: bookingData.duration
  };
  
  console.log("Sending booking payload:", bookingPayload);
  console.log("Selected doctor from providers:", providers.find((p: any) => p._id === bookingData.doctorID));
  
  //mutate(bookingPayload);
};

  // Filter providers by type and specialty
  const filteredProviders = providers.filter((p: any) => {
    // First filter by provider type (Doctor, Nurse, Lab)
    if (providerType === "Doctor" && p.role !== "Doctor") return false;
    if (providerType === "Nurse" && p.role !== "Nurse") return false;
    if (providerType === "Lab" && p.role !== "Lab") return false;
    
    // Then filter by specialization if one is selected
    if (specialization && p.specialization !== specialization) return false;
    
    return true;
  });

  const specializations = Array.from(
    new Set(
      providers
        .filter((p: any) => p.role === providerType)
        .map((p: any) => p.specialization)
        .filter(Boolean) // Remove null/undefined values
    )
  );

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleProviderTypeChange = (type: string) => {
    setProviderType(type);
    setSpecialization("");
    setBookingData(prev => ({ ...prev, doctorID: "" }));
  };

  const handleSpecialtyChange = (spec: string) => {
    setSpecialization(spec);
    setBookingData(prev => ({ ...prev, doctorID: "" }));
  };

  const handleProviderSelect = (id: string) => {
    setBookingData(prev => ({ ...prev, doctorID: id }));
  };

  const handleModeChange = (selectedMode: string) => {
    setMode(selectedMode);
    setBookingData(prev => ({ ...prev, mode: selectedMode }));
  };

  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    handleInputChange("date", formattedDate);
    setDatePickerVisible(false);
  };

  const handleTimeConfirm = (time: Date) => {
    const formattedTime = time.toTimeString().substring(0, 5);
    handleInputChange("time", formattedTime);
    setTimePickerVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back && router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#588157" />
          </TouchableOpacity>
          <Text style={styles.title}>Book Appointment</Text>
        </View>
        {/* Provider Type Card */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Select Provider</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Provider Type *</Text>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {['Doctor', 'Nurse', 'Lab'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, providerType === type && styles.activeTypeButton]}
                  onPress={() => {
                    setProviderType(type);
                    setSpecialization("");
                    setBookingData(prev => ({ ...prev, doctorID: "" }));
                  }}
                  disabled={isLoading}
                >
                  <Text style={[styles.typeButtonText, providerType === type && styles.activeTypeButtonText]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Specialization Card */}
        {specializations.length > 0 && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Specialization *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {specializations.map((spec) => {
                const specStr = String(spec);
                return (
                  <TouchableOpacity
                    key={specStr}
                    style={[styles.typeButton, specialization === specStr && styles.activeTypeButton]}
                    onPress={() => {
                      setSpecialization(specStr);
                      setBookingData(prev => ({ ...prev, doctorID: "" }));
                    }}
                    disabled={isLoading}
                  >
                    <Text style={[styles.typeButtonText, specialization === specStr && styles.activeTypeButtonText]}>{specStr}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Provider Selection Card */}
        {filteredProviders.length > 0 && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Select Provider *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredProviders.map((provider: any) => {
                const id = String(provider._id);
                const name = String(provider.name);
                const spec = String(provider.specialization);
                return (
                  <TouchableOpacity
                    key={id}
                    style={[styles.typeButton, bookingData.doctorID === id && styles.activeTypeButton]}
                    onPress={() => {
                      console.log("Provider clicked:", { id, name, spec });
                      console.log("Setting doctorId to:", id);
                      setBookingData(prev => {
                        const newData = { ...prev, doctorID: id };
                        console.log("Updated bookingData:", newData);
                        return newData;
                      });
                    }}
                    disabled={isLoading}
                  >
                    <Text style={[styles.typeButtonText, bookingData.doctorID === id && styles.activeTypeButtonText]}>{name} ({spec})</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Appointment Details Card */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          {/* Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity
              style={styles.cardInput}
              onPress={() => setDatePickerVisible(true)}
              disabled={isLoading}
            >
              <Text style={styles.dateTimeText}>
                {bookingData.date || "Select date"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
              style={styles.cardInput}
              onPress={() => setTimePickerVisible(true)}
              disabled={isLoading}
            >
              <Text style={styles.dateTimeText}>
                {bookingData.time || "Select time"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Appointment Mode (Online/Offline) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Appointment Type *</Text>
            <View style={styles.typeButtonRow}>
              {['Online', 'Offline'].map((modeType) => (
                <TouchableOpacity
                  key={modeType}
                  style={[styles.typeButton, bookingData.type === modeType.toLowerCase() && styles.activeTypeButton]}
                  onPress={() => {
                    setMode(modeType.toLowerCase());
                    setBookingData(prev => ({ ...prev, type: modeType.toLowerCase() }));
                  }}
                  disabled={isLoading}
                >
                  <Text style={[styles.typeButtonText, bookingData.type === modeType.toLowerCase() && styles.activeTypeButtonText]}>{modeType}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Duration dropdown for Online mode */}
            {bookingData.type === 'online' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Duration (minutes)</Text>
                <TouchableOpacity
                  style={styles.durationContainer}
                  onPress={() => {
                    Alert.alert(
                      "Select Duration",
                      "Choose appointment duration",
                      [
                        { text: "30 min", onPress: () => { setDuration("30"); setBookingData(prev => ({ ...prev, duration: 30 })); } },
                        { text: "45 min", onPress: () => { setDuration("45"); setBookingData(prev => ({ ...prev, duration: 45 })); } },
                        { text: "60 min", onPress: () => { setDuration("60"); setBookingData(prev => ({ ...prev, duration: 60 })); } },
                        { text: "75 min", onPress: () => { setDuration("75"); setBookingData(prev => ({ ...prev, duration: 75 })); } },
                        { text: "90 min", onPress: () => { setDuration("90"); setBookingData(prev => ({ ...prev, duration: 90 })); } },
                        { text: "Cancel", style: "cancel" }
                      ]
                    );
                  }}
                  disabled={isLoading}
                >
                  <Text style={styles.durationText}>
                    {duration ? `${duration} min` : "Select duration"}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* Appointment Type (Consultation, etc.) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Whats This Appointment About*</Text>
            <View style={styles.typeButtonRow}>
              {['Consultation', 'Follow-up', 'Emergency', 'Routine Check'].map((appointmentType) => (
                <TouchableOpacity
                  key={appointmentType}
                  style={[styles.typeButton, bookingData.type === appointmentType && styles.activeTypeButton]}
                  onPress={() => handleInputChange('type', appointmentType)}
                  disabled={isLoading}
                >
                  <Text style={[styles.typeButtonText, bookingData.type === appointmentType && styles.activeTypeButtonText]}>{appointmentType}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Notes
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea, styles.cardInput]}
              value={bookingData.notes}
              onChangeText={(value) => handleInputChange("notes", value)}
              placeholder="Add any additional notes..."
              multiline
              numberOfLines={4}
              editable={!isLoading}
            />
          </View> */}
          {/* Book Button */}
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              console.log("Booking appointment:", bookingData);
              mutate({
              doctorID: bookingData.doctorID,
              date: new Date(bookingData.date), // Convert string to Date object
              time: bookingData.time, // Convert string to number
              type: bookingData.type,
              duration: bookingData.duration
            })}}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
        minimumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerCard: {
    backgroundColor: "#fcfefd",
    borderRadius: 16,
    paddingTop: 25,         // Reduced from 48
    paddingBottom: 15,      // Reduced from 24
    paddingHorizontal: 16,  // Reduced from 24
    marginTop: 12,          // Reduced from 24
    marginBottom: 10,        // Reduced from 12
    marginHorizontal: 0,
    minHeight: 60,          // Reduced from 80
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 10,               // Reduced from 16
    top: 10,                // Reduced from 16
    zIndex: 2,
  },
  title: {
    fontSize: 20,           // Reduced from 24
    fontWeight: "700",
    color: "#111827",       // Changed to black
    textAlign: "center",    // Center the text
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,          // Remove left margin since it's centered
  },
  cardSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#588157",
    marginBottom: 18,
    marginTop: 0,
  },
  inputGroup: {
    marginBottom: 18,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#222",
  },
  cardInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#222",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#222",
  },
  typeButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  typeButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 8,
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTypeButton: {
    backgroundColor: "#f0f4f0",
    borderColor: "#588157",
  },
  typeButtonText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  activeTypeButtonText: {
    color: "#588157",
    fontWeight: "700",
  },
  bookButton: {
    backgroundColor: "#588157",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    width: "100%",
    shadowColor: "#588157",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  bookButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#588157",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    width: "100%",
  },
  cancelButtonText: {
    color: "#588157",
    fontSize: 18,
    fontWeight: "700",
  },
  durationContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "space-between",
    width: 200,
    alignSelf: "flex-start",
    minHeight: 48,
    flexDirection: "row",
  },
  durationText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 16,
    color: "#374151",
  },
});