// import { registerPatient } from "@/api/auth"; // adjust if needed
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   Alert,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";

// export default function RegisterScreen() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     civilID: "",
//     password: "",
//   });

//   const router = useRouter();

//   const handleRegister = async () => {
//     try {
//       const res = await registerPatient(form);
//       Alert.alert("Success", "Patient registered!");
//       router.replace("/auth");
//     } catch (err: any) {
//       console.error(err);
//       Alert.alert(
//         "Error",
//         err?.response?.data?.message || "Registration failed"
//       );
//     }
//   };

//   const handleChange = (key: string, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Register as Patient</Text>

//       {["name", "email", "phone", "civilID", "password"].map((field) => (
//         <TextInput
//           key={field}
//           placeholder={field}
//           value={form[field as keyof typeof form]}
//           onChangeText={(text) => handleChange(field, text)}
//           secureTextEntry={field === "password"}
//           style={styles.input}
//         />
//       ))}

//       <TouchableOpacity style={styles.button} onPress={handleRegister}>
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginVertical: 8,
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: "green",
//     padding: 12,
//     marginTop: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   buttonText: { color: "#fff", fontWeight: "bold" },
// });
