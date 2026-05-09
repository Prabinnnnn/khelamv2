import client from "./client";
import { User } from "../context/AuthContext";

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

const authApi = {
  login: async (credentials: { email?: string; phone?: string; password?: string }) => {
    // Note: Django simple-jwt usually uses 'username' and 'password'
    // or you might have a custom login that accepts email/phone
    const response = await client.post<LoginResponse>("/auth/login/", credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await client.post<LoginResponse>("/auth/register/", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await client.get<User>("/auth/profile/");
    return response.data;
  },

  updateProfile: async (updates: Partial<User>) => {
    const response = await client.patch<User>("/auth/profile/", updates);
    return response.data;
  },

  logout: async () => {
    // Some backends require a blacklist call for the refresh token
    // For now, we'll just handle it client-side if needed
    // return client.post("/auth/logout/");
  }
};

export default authApi;
