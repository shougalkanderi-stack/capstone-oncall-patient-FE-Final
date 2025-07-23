import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../api/auth";
import { PatientInfo } from "../types/PatientInfo";

export default function AIAnalysisScreen() {
  const router = useRouter();
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing AI Analysis...");

  // const { data: profile, isLoading, error } = useQuery({
  //   queryKey: ["profile"],
  //   queryFn: getMyProfile,
  // });
  const {
    data: data,
    isLoading,
    error,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    retry: 2,
    retryDelay: 1000,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const steps = [
      "Initializing AI Analysis...",
      "Processing patient data...",
      "Analyzing medical history...",
      "Reviewing test results...",
      "Generating insights...",
      "Creating recommendations...",
      "Finalizing report...",
    ];

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const currentIndex = steps.indexOf(prev);
        if (currentIndex === steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return steps[currentIndex + 1];
      });
    }, 1000);

    return () => clearInterval(stepInterval);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6d9c7a" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Failed to load profile</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#6d9c7a" />
        </TouchableOpacity>
        <Text style={styles.header}>AI Analysis</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Patient Information Card */}
        <View style={styles.patientCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle" size={24} color="#6d9c7a" />
            <Text style={styles.cardTitle}>Patient Information</Text>
          </View>

          <View style={styles.patientInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>
                {data?.patient?.name || "N/A"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>
                {data?.patient?.email || "N/A"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>
                {data?.patient?.phone || "N/A"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Civil ID:</Text>
              <Text style={styles.infoValue}>
                {data?.patient?.civilID || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* AI Analysis Progress Card */}
        <View style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="analytics" size={24} color="#6d9c7a" />
            <Text style={styles.cardTitle}>AI Analysis Progress</Text>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.currentStep}>{currentStep}</Text>

            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${analysisProgress}%` }]}
              />
            </View>

            <Text style={styles.progressText}>
              {analysisProgress}% Complete
            </Text>
          </View>

          {analysisProgress === 100 && (
            <View style={styles.completionContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#6d9c7a" />
              <Text style={styles.completionText}>
                Analysis's sent to your Email!
              </Text>
              <Text style={styles.completionSubtext}>
                Your AI analysis report is ready for review.
              </Text>
            </View>
          )}
        </View>

        {/* Analysis Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={24} color="#6d9c7a" />
            <Text style={styles.cardTitle}>Analysis Details</Text>
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle" size={20} color="#6d9c7a" />
              <Text style={styles.detailText}>Medical history reviewed</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle" size={20} color="#6d9c7a" />
              <Text style={styles.detailText}>Test results analyzed</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle" size={20} color="#6d9c7a" />
              <Text style={styles.detailText}>Risk factors identified</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle" size={20} color="#6d9c7a" />
              <Text style={styles.detailText}>
                Personalized insights generated
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="checkmark-circle" size={20} color="#6d9c7a" />
              <Text style={styles.detailText}>Recommendations created</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons
        {analysisProgress === 100 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.viewReportButton}>
              <Ionicons name="document" size={20} color="white" />
              <Text style={styles.viewReportButtonText}>View Full Report</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share" size={20} color="#6d9c7a" />
              <Text style={styles.shareButtonText}>Share Report</Text>
            </TouchableOpacity>
          </View>
        )} */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
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
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
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
    marginTop: 16,
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#6d9c7a",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  patientCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 12,
  },
  patientInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  analysisCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    marginBottom: 20,
  },
  currentStep: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6d9c7a",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
  completionContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  completionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 12,
  },
  completionSubtext: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  viewReportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6d9c7a",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewReportButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6d9c7a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    color: "#6d9c7a",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
