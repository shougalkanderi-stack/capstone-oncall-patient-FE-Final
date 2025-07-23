import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getMyProfile, logoutPatient } from "../api/auth";
import {
  addDependent,
  deleteDependent,
  getDependents,
} from "../api/dependents";
import { AppColors } from "../constants/Colors";

type ActiveTab = "home" | "appointments" | "messages" | "profile";

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  contactNumber: string;

  relationship:string;
  // patientId: string;
  medicalHistory: string;
  specialCareInstructions: string;
}

export default function ProfilePage() {
  const [showModal, setShowModal] = useState(false);
  const [showAnalyseModal, setShowAnalyseModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [aiAnalysisConsent, setAiAnalysisConsent] = useState(false);
  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    gender: "",
    contactNumber: "",
    relationship: "Mother",
    birthday: "",
    medicalHistory: "",
    specialCareInstructions: "",
    confirmed: false,
  });
  
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  // Date picker state for date of birth selection
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  // Medical history file upload state
  const [uploadedMedicalFile, setUploadedMedicalFile] = useState<any>(null);

  const [dependentData, setDependentData] = useState({
    name: "",
    age: "",
    relationship: "",
    // patientId: ""
  });
  const [isAddingDependent, setIsAddingDependent] = useState(false);

  const queryClient = useQueryClient();

  // Fetch user profile from backend
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  // Fetch dependents from backend
  const {
    data: dependentsResponse = { dependents: [] },
    isLoading: isDependentsLoading,
    isError: isDependentsError,
    refetch: refetchDependents,
  } = useQuery({
    queryKey: ["dependents"],
    queryFn: getDependents,
  });
  console.log("dependents:", dependentsResponse);
  const dependents = dependentsResponse?.dependents || [];

  // Add dependent mutation
  const addDependentMutation = useMutation({
    mutationFn: addDependent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dependents"] });
      setShowModal(false);
      setPatientForm({
        name: "",
        age: "",
        gender: "",
        contactNumber: "",
        relationship: "", // 🔥 ADD THIS
        birthday: "", // <-- reset birthday
        medicalHistory: "",
        specialCareInstructions: "",
        // patientId: "",
        confirmed: false,
      });
      setDatePickerVisible(false);
      setUploadedMedicalFile(null);
    },
    
    onError: (error) => {
      Alert.alert("Error", "Failed to add dependent");
    },
  });

  // Delete dependent mutation
  const deleteDependentMutation = useMutation({
    mutationFn: deleteDependent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dependents"] });
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to delete dependent");
    },
  });

  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        router.push("/homepage");
        break;
      case "appointments":
        router.push("/appointments");
        break;
      case "messages":
        router.push("/messages");
        break;
      case "profile":
        // Stay on current page
        break;
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setPatientForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Date picker functions
  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    handleInputChange("birthday", formattedDate); // <-- set birthday
    setDatePickerVisible(false);
  };

  // Medical history file upload function
  const handleMedicalHistoryUpload = async () => {
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
        setUploadedMedicalFile(result);
      }
    } catch (e) {
      Alert.alert("Error", "Could not open document picker.");
    }
  };

  // Replace handleAddPatient to use backend
  const handleAddPatient = () => {
    console.log("patientInfo", patientForm);
    if (!patientForm.confirmed) {
      Alert.alert(
        "Confirmation Required",
        "Please confirm that you are registering this person under your caregiving responsibility"
      );
      return;
    }
  
    const careGiverId = profile?._id || profile?.patient?._id;
  
    if (
      !patientForm.name.trim() ||
      !patientForm.gender.trim() ||
      !patientForm.contactNumber.trim() ||
      !patientForm.relationship.trim() ||
      !patientForm.birthday.trim() ||
      !careGiverId||!patientForm.age.trim() 
    ) {
      Alert.alert("Required Fields", "Please fill in all required fields");
      return;
    }
  
    addDependentMutation.mutate({
      name: patientForm.name,
      gender: patientForm.gender,
      contactNumber: patientForm.contactNumber,
      relationship: patientForm.relationship,
      birthday: patientForm.birthday,
      careGiver: profile.patient._id,
      medicalHistory: patientForm.medicalHistory,
      specialCareInstructions: patientForm.specialCareInstructions,
    });
  };
  const {mutate} = useMutation({
    mutationFn: addDependent,
    onSuccess: () => {
      // Optional: do something after success (e.g., refetch, show message)
      Alert.alert("The dependent was added successfully")
    },
    onError: (error) => {
      // Optional: handle error
      Alert.alert(`Error`)
    },
  });
  // mutate({
  //   name: patientForm.name,
  //   age: patientForm.age,
  //   relationship: patientForm.relationship
  // });
    
  //   addDependentMutation.mutate({
  //     name: patientForm.name,
  //     age: patientForm.age,
  //     gender: patientForm.gender,
  //     contactNumber: patientForm.contactNumber,
  //     relationship: patientForm.relationship, // 🔥 ADD THIS
  //     birthday: patientForm.birthday, // <-- send birthday
  //     careGiver: profile?._id || profile?.patient?._id, // <-- add this line
  //     medicalHistory: patientForm.medicalHistory,
  //     specialCareInstructions: patientForm.specialCareInstructions,
  //   });
    
  // };
  

  const handleDependentInputChange = (field: string, value: string) => {
    setDependentData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDependent = async () => {
    if (!dependentData.name.trim() || !dependentData.age.trim() || !dependentData.relationship.trim() ) {
      Alert.alert("Error", "Please fill in all required fields for person in care.");
      return;
    }
    setIsAddingDependent(true);
    try {
      await addDependent({
        name: dependentData.name,
        age: dependentData.age,
        relationship: dependentData.relationship,
        // patientId: dependentData.patientId
      });
      Alert.alert("Success", "Person in care added successfully!");
      setDependentData({ name: "", age: "", relationship: ""});
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add person in care.");
    } finally {
      setIsAddingDependent(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutPatient();
            router.push("/login");
          } catch (error) {
            console.error("Logout error:", error);
            // Even if logout fails, clear token and redirect
            router.push("/login");
          }
        },
      },
    ]);
  };

  const renderTabIcon = (tabName: ActiveTab, iconName: string) => {
    const isActive = activeTab === tabName;
    return (
      <Ionicons
        name={iconName as any}
        size={24}
        color={isActive ? "#6d9c7a" : "#9ca3af"}
      />
    );
  };

  if (isProfileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6d9c7a" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isProfileError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetchProfile()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#6d9c7a" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#6d9c7a" />
            </View>
          </View>
          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>
              {profile?.patient?.name || "Patient"}
            </Text>
            <Text style={styles.profileRole}>Patient</Text>
            <Text style={styles.profileJoined}>
              Civil ID: {profile?.patient?.civilID || "N/A"}
            </Text>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={20} color="#6d9c7a" />
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>
                {profile?.patient?.email || "N/A"}
              </Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>
                {profile?.patient?.phone || "N/A"}
              </Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Civil ID</Text>
              <Text style={styles.infoValue}>
                {profile?.patient?.civilID || "N/A"}
              </Text>
            </View>
            <View style={styles.infoGridItem}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {profile?.patient?.createdAt
                  ? new Date(profile.patient.createdAt).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Patients Under Care */}
        {isDependentsLoading ? (
          <ActivityIndicator size="small" color={AppColors.primary} />
        ) : isDependentsError ? (
          <Text style={{ color: "red" }}>Failed to load dependents</Text>
        ) : (
          dependents.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>People Under My Care</Text>
              {dependents.map(
                (patient: any) => (
                  console.log("patient name", patient.name),
                  (
                    <View key={patient.id} style={styles.patientCard}>
                      <Text style={styles.patientName}>{patient.name}</Text>
                      <View style={styles.patientInfo}>
                        <View style={styles.patientInfoRow}>
                          <Text style={styles.patientInfoLabel}>
                            Relationship:
                          </Text>
                          <Text style={styles.patientInfoValue}>"Mother"</Text>
                        </View>
                        <View style={styles.patientInfoRow}>
                          <Text style={styles.patientInfoLabel}>Gender:</Text>
                          <Text style={styles.patientInfoValue}>"Male"</Text>
                        </View>
                        <View style={styles.patientInfoRow}>
                          <Text style={styles.patientInfoLabel}>Age:</Text>
                          <Text style={styles.patientInfoValue}>"12"</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{ marginTop: 8, alignSelf: "flex-end" }}
                        onPress={() =>
                          deleteDependentMutation.mutate(patient.id)
                        }
                      >
                        <Ionicons name="trash" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  )
                )
              )}
            </View>
          )
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.careButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.careButtonText}>I am a person in care</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.careButton}
            onPress={() => setShowConsentModal(true)}
          >
            <Text style={styles.careButtonText}>Analyse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="arrow-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Patient</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
            <Text style={styles.label}>name *</Text>
            <TextInput
              style={styles.input}
              value={patientForm.name}
              onChangeText={value => handleInputChange("name", value)}
              placeholder="Enter name"
            />
          </View>

               <View style={styles.inputGroup}>
            <Text style={styles.label}>age *</Text>
            <TextInput
              style={styles.input}
              value={patientForm.age}
              onChangeText={value => handleInputChange("age", value)}
              placeholder="Enter age"
              keyboardType="numeric"
            />
          </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>gender *</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    patientForm.gender === "male" &&
                      styles.pickerOptionSelected,
                  ]}
                  onPress={() => handleInputChange("gender", "male")}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      patientForm.gender === "male" &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pickerOption,
                    patientForm.gender === "female" &&
                      styles.pickerOptionSelected,
                  ]}
                  onPress={() => handleInputChange("gender", "female")}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      patientForm.gender === "female" &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>contact Number *</Text>
              <TextInput
                style={styles.formInput}
                value={patientForm.contactNumber}
                onChangeText={(value) =>
                  handleInputChange("contactNumber", value)
                }
                placeholder="Enter contact number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
    <View style={styles.inputGroup}>
            <Text style={styles.label}>relationship *</Text>
            <TextInput
              style={styles.input}
              value={patientForm.relationship}
              onChangeText={value => handleInputChange("relationship", value)}
              placeholder="Enter relationship"
            />
          </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Birthday *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setDatePickerVisible(true)}
              >
                <Text style={{ color: patientForm.birthday ? '#111827' : '#9ca3af' }}>
                  {patientForm.birthday || 'Select birthday'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Medical History</Text>
              <View style={styles.medicalHistoryContainer}>
                <TextInput
                  style={[
                    styles.formInput,
                    styles.textArea,
                    styles.medicalHistoryInput,
                  ]}
                  value={patientForm.medicalHistory}
                  onChangeText={(value) =>
                    handleInputChange("medicalHistory", value)
                  }
                  placeholder="Enter medical history"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={styles.uploadButtonInside}
                  onPress={handleMedicalHistoryUpload}
                >
                  <Ionicons name="cloud-upload" size={18} color="white" />
                </TouchableOpacity>
              </View>
              {uploadedMedicalFile && (
                <View style={styles.uploadedFileContainer}>
                  <Text style={styles.uploadedFileName}>
                    📎 {uploadedMedicalFile.name}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Special Care Instructions</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={patientForm.specialCareInstructions}
                onChangeText={(value) =>
                  handleInputChange("specialCareInstructions", value)
                }
                placeholder="Enter special care instructions"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            {/* </View>
              <View style={styles.inputGroup}>
            <Text style={styles.label}>patientId *</Text>
            <TextInput
              style={styles.input}
              value={dependentData.patientId}
              onChangeText={value => handleDependentInputChange("patientId", value)}
              placeholder="Enter patient ID"
            /> */}
          </View>
         
          </ScrollView>

          {/* Fixed Bottom Section */}
          <View style={styles.modalBottomSection}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() =>
                  handleInputChange("confirmed", !patientForm.confirmed)
                }
              >
                {patientForm.confirmed && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color="#6d9c7a"
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I confirm that I am registering this person under my caregiving
                responsibility
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={()=>mutate({
                name:patientForm.name,
                age: patientForm.age,
                relationship:patientForm.relationship
              })}
              // mutate({
              //   name: patientForm.name,
              //   age: patientForm.age,
              //   relationship: patientForm.relationship
              // });
            >
              <Text style={styles.addButtonText}>Add Patient</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisible(false)}
        />
      </Modal>

      {/* Analyse Modal */}
      <Modal
        visible={showAnalyseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackButton}
              onPress={() => setShowAnalyseModal(false)}
            >
              <Ionicons name="arrow-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Medical Report Analysis</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAnalyseModal(false)}
            >
              <Ionicons name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.analyseSection}>
              <Text style={styles.analyseTitle}>Medical Report</Text>
              
              <View style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <Ionicons name="document-text" size={24} color="#6d9c7a" />
                  <Text style={styles.reportTitle}>Blood Test Report</Text>
                  <View style={styles.reportStatus}>
                    <Text style={styles.reportStatusText}>Completed</Text>
                  </View>
                </View>
                
                <View style={styles.reportInfo}>
                  <View style={styles.reportInfoRow}>
                    <Text style={styles.reportInfoLabel}>Patient Name:</Text>
                    <Text style={styles.reportInfoValue}>
                      {profile?.patient?.name || "N/A"}
                    </Text>
                  </View>
                  <View style={styles.reportInfoRow}>
                    <Text style={styles.reportInfoLabel}>Report Date:</Text>
                    <Text style={styles.reportInfoValue}>December 15, 2024</Text>
                  </View>
                  <View style={styles.reportInfoRow}>
                    <Text style={styles.reportInfoLabel}>Test Type:</Text>
                    <Text style={styles.reportInfoValue}>Complete Blood Count</Text>
                  </View>
                  <View style={styles.reportInfoRow}>
                    <Text style={styles.reportInfoLabel}>Lab:</Text>
                    <Text style={styles.reportInfoValue}>Central Medical Lab</Text>
                  </View>
                </View>

                <View style={styles.reportResults}>
                  <Text style={styles.resultsTitle}>Test Results</Text>
                  
                  <View style={styles.resultItem}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultName}>Hemoglobin</Text>
                      <Text style={styles.resultValue}>14.2 g/dL</Text>
                    </View>
                    <Text style={styles.resultRange}>Normal Range: 13.5-17.5 g/dL</Text>
                    <View style={styles.resultStatus}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>Normal</Text>
                    </View>
                    <TouchableOpacity style={styles.pdfLink}>
                      <Ionicons name="document-text" size={16} color="#6d9c7a" />
                      <Text style={styles.pdfLinkText}>View PDF Report</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.resultItem}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultName}>White Blood Cells</Text>
                      <Text style={styles.resultValue}>7.5 K/μL</Text>
                    </View>
                    <Text style={styles.resultRange}>Normal Range: 4.5-11.0 K/μL</Text>
                    <View style={styles.resultStatus}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>Normal</Text>
                    </View>
                    <TouchableOpacity style={styles.pdfLink}>
                      <Ionicons name="document-text" size={16} color="#6d9c7a" />
                      <Text style={styles.pdfLinkText}>View PDF Report</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.resultItem}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultName}>Platelets</Text>
                      <Text style={styles.resultValue}>250 K/μL</Text>
                    </View>
                    <Text style={styles.resultRange}>Normal Range: 150-450 K/μL</Text>
                    <View style={styles.resultStatus}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>Normal</Text>
                    </View>
                    <TouchableOpacity style={styles.pdfLink}>
                      <Ionicons name="document-text" size={16} color="#6d9c7a" />
                      <Text style={styles.pdfLinkText}>View PDF Report</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.reportSummary}>
                  <Text style={styles.summaryTitle}>Summary</Text>
                  <Text style={styles.summaryText}>
                    All blood test parameters are within normal ranges. No abnormalities detected. 
                    The patient's overall health indicators are good.
                  </Text>
                </View>

                <View style={styles.aiAnalysisSection}>
                  <Text style={styles.aiAnalysisTitle}>AI Analysis</Text>
                  <Text style={styles.aiAnalysisText}>
                    AI-powered analysis of your medical data provides personalized insights and recommendations.
                  </Text>
                  <TouchableOpacity 
                    style={styles.aiAnalysisButton}
                    onPress={() => {
                      setShowAnalyseModal(false);
                      setShowConsentModal(true);
                    }}
                  >
                    <Ionicons name="analytics" size={20} color="white" />
                    <Text style={styles.aiAnalysisButtonText}>View AI Analysis</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.downloadButton}>
                  <Ionicons name="download" size={20} color="#6d9c7a" />
                  <Text style={styles.downloadText}>Download Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Consent Modal */}
      <Modal
        visible={showConsentModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackButton}
              onPress={() => setShowConsentModal(false)}
            >
              <Ionicons name="arrow-back" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>AI Analysis Consent</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowConsentModal(false)}
            >
              <Ionicons name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.consentSection}>
              <View style={styles.consentIcon}>
                <Ionicons name="shield-checkmark" size={48} color="#6d9c7a" />
              </View>
              
              <Text style={styles.consentTitle}>AI Analysis Consent Agreement</Text>
              
              <Text style={styles.consentText}>
                By proceeding with AI analysis, you agree to the following terms:
              </Text>
              
              <View style={styles.consentPoints}>
                <View style={styles.consentPoint}>
                  <Ionicons name="checkmark-circle" size={20} color="#6d9c7a" />
                  <Text style={styles.consentPointText}>
                    Your medical data will be analyzed using AI technology to provide personalized insights
                  </Text>
                </View>
                
                <View style={styles.consentPoint}>
                  <Ionicons name="checkmark-circle" size={20} color="#6d9c7a" />
                  <Text style={styles.consentPointText}>
                    All data processing follows strict privacy and security protocols
                  </Text>
                </View>
                
                <View style={styles.consentPoint}>
                  <Ionicons name="checkmark-circle" size={20} color="#6d9c7a" />
                  <Text style={styles.consentPointText}>
                    AI analysis results are for informational purposes and should not replace professional medical advice
                  </Text>
                </View>
                
                <View style={styles.consentPoint}>
                  <Ionicons name="checkmark-circle" size={20} color="#6d9c7a" />
                  <Text style={styles.consentPointText}>
                    You can withdraw consent at any time through your profile settings
                  </Text>
                </View>
              </View>
              
              <View style={styles.consentCheckbox}>
                <TouchableOpacity
                  style={[
                    styles.consentCheckboxButton,
                    { backgroundColor: aiAnalysisConsent ? "#6d9c7a" : "white" }
                  ]}
                  onPress={() => setAiAnalysisConsent(!aiAnalysisConsent)}
                >
                  {aiAnalysisConsent && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
                <Text style={styles.consentCheckboxText}>
                  I understand and agree to the AI analysis terms and conditions
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Modal Bottom Section */}
          <View style={styles.modalBottomSection}>
            <TouchableOpacity
              style={[
                styles.proceedButton,
                !aiAnalysisConsent && styles.proceedButtonDisabled
              ]}
              onPress={() => {
                if (aiAnalysisConsent) {
                  setShowConsentModal(false);
                  router.push("/ai-analysis");
                }
              }}
              disabled={!aiAnalysisConsent}
            >
              <Text style={styles.proceedButtonText}>Proceed to AI Analysis</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#6d9c7a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#eaf7ef",
    borderWidth: 1,
    borderColor: "#8bb2a3",
  },
  logoutText: {
    color: "#6d9c7a",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    position: "relative",
  },
  avatarContainer: {
    marginRight: 16,
  },
  profileInfoContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  editIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 8,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppColors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  profileJoined: {
    fontSize: 12,
    color: "#9ca3af",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#6b7280",
  },
  patientCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e8f5e8",
    marginBottom: 12,
    shadowColor: "#588157",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  patientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#588157",
    marginBottom: 12,
  },
  patientInfo: {
    gap: 8,
    marginBottom: 8,
  },
  patientInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  patientInfoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginRight: 8,
    minWidth: 80,
  },
  patientInfoValue: {
    fontSize: 14,
    color: "#588157",
    fontWeight: "500",
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  careButton: {
    backgroundColor: "#588157",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#588157",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  careButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

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
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalBottomSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "white",
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#E1EEBC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  formInputText: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    marginRight: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 8,
  },
  pickerOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E1EEBC",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "white",
  },
  pickerOptionSelected: {
    borderColor: "#6d9c7a",
    backgroundColor: "#eaf7ef",
  },
  pickerOptionText: {
    fontSize: 16,
    color: "#6b7280",
  },
  pickerOptionTextSelected: {
    color: "#6d9c7a",
    fontWeight: "500",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#E1EEBC",
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: AppColors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
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
    color: "#6d9c7a",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  infoGridItem: {
    width: "48%",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E1EEBC",
  },
  medicalHistoryContainer: {
    position: "relative",
  },
  medicalHistoryInput: {
    paddingRight: 50, // Make space for the upload button
  },
  uploadButtonInside: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -16 }], // Half of the button height (32/2)
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6d9c7a",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6d9c7a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadedFileContainer: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: AppColors.surfaceLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  uploadedFileName: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#6d9c7a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#6d9c7a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  partCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1EEBC",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E1EEBC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "white",
  },
  bookButton: {
    backgroundColor: "#6d9c7a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#6d9c7a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  analyseSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  analyseTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  analyseSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  uploadReportButton: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  uploadReportText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6d9c7a",
    marginTop: 12,
  },
  uploadReportSubtext: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  uploadedReportContainer: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  uploadedReportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadedReportName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginLeft: 10,
  },
  analyseButton: {
    backgroundColor: "#6d9c7a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#6d9c7a",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  analyseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  recentAnalysisCard: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
  },
  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  analysisDate: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
  },
  analysisSummary: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 12,
  },
  viewAnalysisButton: {
    alignSelf: "flex-end",
  },
  viewAnalysisText: {
    fontSize: 14,
    color: "#6d9c7a",
    textDecorationLine: "underline",
  },
  reportCard: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 10,
  },
  reportStatus: {
    backgroundColor: "#eaf7ef",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 10,
  },
  reportStatusText: {
    fontSize: 12,
    color: "#6d9c7a",
    fontWeight: "500",
  },
  reportInfo: {
    marginBottom: 16,
  },
  reportInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reportInfoLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  reportInfoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  reportResults: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  resultItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E1EEBC",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  resultName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  resultValue: {
    fontSize: 14,
    color: "#6d9c7a",
    fontWeight: "500",
  },
  resultRange: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  resultStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6d9c7a",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#6d9c7a",
    fontWeight: "500",
  },
  reportSummary: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "flex-start",
  },
  downloadText: {
    fontSize: 16,
    color: "#6d9c7a",
    fontWeight: "500",
    marginLeft: 8,
  },
  pdfLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pdfLinkText: {
    fontSize: 14,
    color: "#6d9c7a",
    marginLeft: 8,
    fontWeight: "500",
  },
  aiAnalysisSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  aiAnalysisTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  aiAnalysisText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },
  aiAnalysisButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6d9c7a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  aiAnalysisButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  consentSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  consentIcon: {
    marginBottom: 24,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eaf7ef",
    justifyContent: "center",
    alignItems: "center",
  },
  consentTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  consentText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  consentPoints: {
    width: "100%",
    marginBottom: 32,
  },
  consentPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  consentPointText: {
    fontSize: 15,
    color: "#374151",
    flex: 1,
    lineHeight: 22,
    marginRight: 20,
  },
  consentCheckbox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingHorizontal: 4,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  consentCheckboxButton: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#6d9c7a",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  consentCheckboxText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
    marginRight: 16,
    fontWeight: "500",
    flex: 1,
  },
  proceedButton: {
    backgroundColor: "#6d9c7a",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#6d9c7a",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
  },
  proceedButtonDisabled: {
    backgroundColor: "#d1d5db",
    opacity: 0.6,
    shadowOpacity: 0,
  },
  proceedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});