import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DEFAULT_USER, useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1000));
    await login({ ...DEFAULT_USER, email });
    setLoading(false);
    router.replace("/(tabs)/discover");
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0D0D0D" }]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <View style={[styles.logoMark, { backgroundColor: "#C8F248" }]}>
              <Text style={styles.logoK}>K</Text>
            </View>
          </View>

          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.sub}>Log in to find your game</Text>

          <View style={styles.form}>
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: "#FF4D4D22", borderColor: "#FF4D4D44" }]}>
                <Ionicons name="alert-circle" size={16} color="#FF4D4D" />
                <Text style={{ color: "#FF4D4D", fontSize: 13, flex: 1 }}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email or Phone</Text>
              <View style={[styles.inputWrap, { backgroundColor: "#1A1A1A", borderColor: "#2E2E2E" }]}>
                <Ionicons name="mail-outline" size={18} color="#9E9E9E" />
                <TextInput
                  style={[styles.input, { color: "#FFF" }]}
                  placeholder="you@example.com"
                  placeholderTextColor="#9E9E9E"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrap, { backgroundColor: "#1A1A1A", borderColor: "#2E2E2E" }]}>
                <Ionicons name="lock-closed-outline" size={18} color="#9E9E9E" />
                <TextInput
                  style={[styles.input, { color: "#FFF" }]}
                  placeholder="Your password"
                  placeholderTextColor="#9E9E9E"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#9E9E9E"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.forgotRow}
                onPress={() => router.push("/forgot-password")}
              >
                <Text style={[styles.forgot, { color: "#C8F248" }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: loading ? "#A0C43A" : "#C8F248", opacity: loading ? 0.8 : 1 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>{loading ? "Logging in..." : "Log In"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/signup")}
            style={styles.signupRow}
          >
            <Text style={{ color: "#9E9E9E", fontSize: 14 }}>
              Don't have an account?{" "}
              <Text style={{ color: "#C8F248", fontWeight: "700" }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, gap: 8 },
  back: { marginBottom: 24, width: 40 },
  logoRow: { alignItems: "center", marginBottom: 24 },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoK: { fontSize: 28, fontWeight: "900", color: "#0D0D0D" },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
  },
  sub: { fontSize: 15, color: "#9E9E9E", textAlign: "center", marginBottom: 32 },
  form: { gap: 16 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  fieldGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600", color: "#9E9E9E" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  forgotRow: { alignItems: "flex-end", marginTop: 4 },
  forgot: { fontSize: 13, fontWeight: "600" },
  btnPrimary: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
  signupRow: { alignItems: "center", marginTop: 24 },
});
