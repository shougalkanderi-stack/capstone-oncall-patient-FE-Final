import React from "react";
import { StyleSheet, TextInput, TextInputProps, TextStyle } from "react-native";

interface InputProps extends TextInputProps {
  style?: TextStyle;
}

export function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "white",
  },
});
