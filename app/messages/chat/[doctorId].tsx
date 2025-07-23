import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const doctorData: Record<string, { name: string; specialty: string }> = {
  "1": { name: "Dr. Shahad Abdulraheem", specialty: "Neurologist" },
  "2": { name: "Dr. Jana Alhamad", specialty: "Dermatologist" },
  "3": { name: "Dr. Shoug Alkanderi", specialty: "Physical Therapy" },
  "4": { name: "Dr. Fatma Zamanan", specialty: "Cardiologist" },
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function DoctorChatPage() {
  const router = useRouter();
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
  const doctor = doctorData[doctorId || "1"];
  const [input, setInput] = useState("");
  
  // Get initial message based on doctor's specialty
  const getInitialMessage = (specialty: string) => {
    switch (specialty) {
      case "Neurologist":
        return "Hello! I'm here to help with any neurological concerns you may have.";
      case "Dermatologist":
        return "Hi there! How can I assist you with your skin health today?";
      case "Physical Therapy":
        return "Hello! I'm here to help with your physical therapy needs and exercises.";
      case "Cardiologist":
        return "Hello! I'm here to help with any heart health questions you may have.";
      default:
        return "Hello! How can I help you today?";
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: getInitialMessage(doctor?.specialty || ""),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      return () => {};
    }, [])
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input.trim(),
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "transparent" },
          headerTransparent: true,
          headerTintColor: "transparent",
          headerBackVisible: false,
        }}
      />
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={false}
        hidden={false}
      />
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#1f2937" />
            </TouchableOpacity>
            <View style={styles.profileSection}>
              <View style={styles.profilePicture}>
                <Ionicons name="person" size={22} color="#588157" />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.headerInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.doctorName} numberOfLines={1} ellipsizeMode="tail">
                    {doctor?.name || "Doctor"}
                  </Text>
                  <Text style={styles.doctorSpecialty}>• Active now</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton} activeOpacity={0.7}>
              <Ionicons name="call" size={18} color="#1f2937" />
            </TouchableOpacity>
          </View>

          {/* Chat Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatArea}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((message, index) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser
                    ? styles.messageContainerUser
                    : styles.messageContainerDoctor,
                ]}
              >
                {!message.isUser && (
                  <View style={styles.doctorAvatar}>
                    <Ionicons name="person" size={16} color="#588157" />
                  </View>
                )}
                <View style={styles.messageContent}>
                  <View
                    style={[
                      styles.messageBubble,
                      message.isUser
                        ? styles.messageBubbleUser
                        : styles.messageBubbleDoctor,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        message.isUser
                          ? styles.messageTextUser
                          : styles.messageTextDoctor,
                      ]}
                    >
                      {message.text}
                    </Text>
                  </View>
                  <Text style={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <View style={styles.inputBar}>
              <TouchableOpacity style={styles.attachmentButton} activeOpacity={0.7}>
                <Ionicons name="attach" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Write your message"
                placeholderTextColor="#9ca3af"
                multiline
                maxLength={500}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.micButton} activeOpacity={0.7}>
                <Ionicons name="mic" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.emojiButton} activeOpacity={0.7}>
                <Ionicons name="happy" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 20,
    paddingTop: 90,
    paddingRight: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 0,
    justifyContent: "flex-start",
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    position: "relative",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 0,
    marginRight: 8,
    flexShrink: 1,
    letterSpacing: 0.2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
    position: "absolute",
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
    letterSpacing: 0.1,
    flexShrink: 1,
  },
  callButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chatArea: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    marginVertical: 4,
  },
  messageContainerUser: {
    alignItems: "flex-end",
  },
  messageContainerDoctor: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  doctorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
  },
  messageContent: {
    flex: 1,
  },
  messageBubble: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: "80%",
    minWidth: 50,
  },
  messageBubbleDoctor: {
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  messageBubbleUser: {
    backgroundColor: "#588157",
    borderBottomRightRadius: 6,
    shadowColor: "#588157",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 18,
  },
  messageTextDoctor: {
    color: "#374151",
  },
  messageTextUser: {
    color: "#ffffff",
  },
  timestamp: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 3,
    marginHorizontal: 4,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 34 : 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    gap: 8,
  },
  attachmentButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
  },
  emojiButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#374151",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    maxHeight: 100,
    minHeight: 44,
    textAlignVertical: "center",
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#f1f5f9",
    shadowOpacity: 0,
    elevation: 0,
  },
});
