import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// In Expo, variables starting with EXPO_PUBLIC_ are automatically loaded
// Replace with your local IP (e.g., http://192.168.1.10:8000/api) for physical device testing
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8000/api"; 

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach JWT Token and Log Request
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("khelam_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    if (config.data) console.log("📦 Body:", JSON.stringify(config.data, null, 2));
    return config;
  },
  (error) => {
    console.error("❌ [API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors and Log Response
client.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Response] ${response.status} from ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error(`❌ [API Error] ${error.message}`);
    if (error.response) {
      console.log("📥 Error Data:", JSON.stringify(error.response.data, null, 2));
      if (error.response.status === 401) {
        await AsyncStorage.removeItem("khelam_token");
        await AsyncStorage.removeItem("khelam_user");
      }
    } else {
      console.log("⚠️ No response received. Check if the server is running and the IP is correct.");
    }
    return Promise.reject(error);
  }
);

export default client;
