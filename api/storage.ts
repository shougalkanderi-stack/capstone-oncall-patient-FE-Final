import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (key: string, token: string) => {
  await AsyncStorage.setItem(key, token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const clearToken = async () => {
  await AsyncStorage.removeItem("token");
};
