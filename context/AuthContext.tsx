import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import authApi, { RegisterData } from "../api/auth";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  sport: string;
  avatar: string;
  memberSince: string;
  isHost: boolean;
  hostStatus: "not_applied" | "pending" | "verified";
  hostId?: string;
  gamesPlayed: number;
  gamesHosted: number;
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email?: string; phone?: string; password?: string }) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  selectedCity: string;
  selectedSport: string;
  setSelectedCity: (city: string) => void;
  setSelectedSport: (sport: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_USER: User = {
  id: "user_1",
  name: "Aarav Shrestha",
  email: "aarav@example.com",
  phone: "+977 9841234567",
  address: "Kathmandu, Nepal",
  city: "Kathmandu",
  sport: "Futsal",
  avatar: "",
  memberSince: "May 2024",
  isHost: false,
  hostStatus: "not_applied",
  hostId: "host_aarav",
  gamesPlayed: 14,
  gamesHosted: 2,
  walletBalance: 500,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCityState] = useState("Kathmandu");
  const [selectedSport, setSelectedSportState] = useState("Futsal");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const [storedUser, token] = await Promise.all([
        AsyncStorage.getItem("khelam_user"),
        AsyncStorage.getItem("khelam_token")
      ]);

      if (storedUser && token) {
        const parsed = JSON.parse(storedUser);
        
        const cityName = typeof parsed.city === 'object' && parsed.city !== null 
          ? (parsed.city as any).name 
          : parsed.city;

        setUser(parsed);
        setSelectedCityState(cityName || "Kathmandu");
        setSelectedSportState(parsed.sport || "Futsal");
        
        // Optional: Refresh profile from backend to ensure data is fresh
        try {
          const freshUser = await authApi.getProfile();
          
          const freshCityName = typeof freshUser.city === 'object' && freshUser.city !== null 
            ? (freshUser.city as any).name 
            : freshUser.city;

          setUser(freshUser);
          setSelectedCityState(freshCityName || "Kathmandu");
          await AsyncStorage.setItem("khelam_user", JSON.stringify(freshUser));
        } catch (err) {
          console.log("Failed to refresh profile:", err);
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email?: string; phone?: string; password?: string }) => {
    const data = await authApi.login(credentials);
    await Promise.all([
      AsyncStorage.setItem("khelam_token", data.access),
      AsyncStorage.setItem("khelam_refresh_token", data.refresh),
      AsyncStorage.setItem("khelam_user", JSON.stringify(data.user))
    ]);
    
    // Handle city if it's an object {id, name, state, country}
    const cityName = typeof data.user.city === 'object' && data.user.city !== null 
      ? (data.user.city as any).name 
      : data.user.city;

    setUser(data.user);
    setSelectedCityState(cityName || "Kathmandu");
    setSelectedSportState(data.user.sport || "Futsal");
  };

  const register = async (registerData: RegisterData) => {
    const data = await authApi.register(registerData);
    
    // If backend returns tokens, log the user in immediately
    if (data.access && data.user) {
      await Promise.all([
        AsyncStorage.setItem("khelam_token", data.access),
        AsyncStorage.setItem("khelam_refresh_token", data.refresh),
        AsyncStorage.setItem("khelam_user", JSON.stringify(data.user))
      ]);

      const cityName = typeof data.user.city === 'object' && data.user.city !== null 
        ? (data.user.city as any).name 
        : data.user.city;

      setUser(data.user);
      setSelectedCityState(cityName || "Kathmandu");
      setSelectedSportState(data.user.sport || "Futsal");
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    const data = await authApi.verifyOtp(email, otp);
    await Promise.all([
      AsyncStorage.setItem("khelam_token", data.access),
      AsyncStorage.setItem("khelam_refresh_token", data.refresh),
      AsyncStorage.setItem("khelam_user", JSON.stringify(data.user))
    ]);

    const cityName = typeof data.user.city === 'object' && data.user.city !== null 
      ? (data.user.city as any).name 
      : data.user.city;

    setUser(data.user);
    setSelectedCityState(cityName || "Kathmandu");
    setSelectedSportState(data.user.sport || "Futsal");
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem("khelam_user"),
      AsyncStorage.removeItem("khelam_token"),
      AsyncStorage.removeItem("khelam_refresh_token")
    ]);
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = await authApi.updateProfile(updates);
    await AsyncStorage.setItem("khelam_user", JSON.stringify(updated));
    setUser(updated);
  };

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    if (user) updateUser({ city });
  };

  const setSelectedSport = (sport: string) => {
    setSelectedSportState(sport);
    if (user) updateUser({ sport });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        verifyOtp,
        logout,
        updateUser,
        selectedCity,
        selectedSport,
        setSelectedCity,
        setSelectedSport,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { DEFAULT_USER };

