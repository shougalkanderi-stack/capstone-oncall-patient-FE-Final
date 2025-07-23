/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#588157"; // Custom green shade
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

// New color scheme constants with #588157 green and gradients
export const AppColors = {
  primary: "#588157", // Custom green shade
  primaryLight: "#6B9A6F", // Lighter version of the green
  primaryDark: "#4A6B4E", // Darker version of the green
  secondary: "#9EC6F3", // Blue that complements the green
  secondaryLight: "#B3D4F7", // Lighter blue
  secondaryDark: "#8AB8E8", // Darker blue
  accent: "#9EC6F3", // Blue for gradient effects
  accentLight: "#B3D4F7", // Lighter blue
  accentDark: "#8AB8E8", // Darker blue
  background: "#F8FCF9", // Very light green-tinted background
  surface: "#E8F5E9", // Light green surface
  surfaceLight: "#F1F8F2", // Very light green surface
  text: "#1A2E1A", // Dark green-tinted text
  textSecondary: "#4A5D4A", // Medium green-tinted text
  textMuted: "#6B7A6B", // Muted green-tinted text
  border: "#D4E6D4", // Light green border
  success: "#588157", // Same as primary
  warning: "#F39C12", // Orange for warnings
  error: "#E74C3C", // Red for errors
  gradient: {
    start: "#588157", // Custom green
    middle: "#9EC6F3", // Blue
    end: "#9EC6F3", // Blue
  },
};
