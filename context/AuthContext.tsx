import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

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
  login: (user: User) => Promise<void>;
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
      const stored = await AsyncStorage.getItem("khelam_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setSelectedCityState(parsed.city || "Kathmandu");
        setSelectedSportState(parsed.sport || "Futsal");
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    await AsyncStorage.setItem("khelam_user", JSON.stringify(userData));
    setUser(userData);
    setSelectedCityState(userData.city);
    setSelectedSportState(userData.sport);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("khelam_user");
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
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
