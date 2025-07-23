import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { createContext, useContext, useState } from "react";
import "react-native-reanimated";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ❤️ Doctor Favorites (patient perspective)
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

interface FavouritesContextType {
  favouriteDoctors: Doctor[];
  toggleFavourite: (doctor: Doctor) => void;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(
  undefined
);

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error("useFavourites must be used within FavouritesProvider");
  }
  return ctx;
}

function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favouriteDoctors, setFavouriteDoctors] = useState<Doctor[]>([]);

  const toggleFavourite = (doctor: Doctor) => {
    setFavouriteDoctors((prev) => {
      const isFav = prev.some((d) => d.id === doctor.id);
      return isFav ? prev.filter((d) => d.id !== doctor.id) : [...prev, doctor];
    });
  };

  return (
    <FavouritesContext.Provider value={{ favouriteDoctors, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

// ✅ Patient-side layout
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <FavouritesProvider>
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
          >
            {/* ✅ Patient auth & flow */}
            <Stack.Screen name="auth" />
            <Stack.Screen name="homepage" />
            <Stack.Screen name="home" />
            <Stack.Screen name="appointments" />
            <Stack.Screen name="messages" />
            <Stack.Screen name="messages/chat/[doctorId]" />
            <Stack.Screen name="profile" />

            {/* ✅ Bottom tab view for patients */}
            <Stack.Screen name="(tabs)" />

            {/* 🚨 404 fallback */}
            <Stack.Screen name="+not-found" />
          </Stack>

          <StatusBar style="auto" />
        </FavouritesProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
