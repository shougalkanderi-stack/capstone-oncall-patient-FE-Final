import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "transparent" },
        headerTransparent: true,
        headerTintColor: "transparent",
        headerBackVisible: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    />
  );
}
