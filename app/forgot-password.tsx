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

import { useColors } from "@/hooks/useColors";

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
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

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={[styles.iconCircle, { backgroundColor: "#C8F24820" }]}>
                <Ionicons name="lock-open-outline" size={32} color="#C8F248" />
              </View>
              <Text style={styles.heading}>Reset Password</Text>
              <Text style={styles.sub}>
                {sent 
                  ? "We've sent a recovery link to your email." 
                  : "Enter your email address and we'll send you a link to reset your password."}
              </Text>
            </View>

            {!sent ? (
              <View style={styles.form}>
                {error ? (
                  <View style={[styles.errorBox, { backgroundColor: "#FF4D4D22", borderColor: "#FF4D4D44" }]}>
                    <Ionicons name="alert-circle" size={16} color="#FF4D4D" />
                    <Text style={{ color: "#FF4D4D", fontSize: 13, flex: 1 }}>{error}</Text>
                  </View>
                ) : null}

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email Address</Text>
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

                <TouchableOpacity
                  style={[styles.btnPrimary, { backgroundColor: loading ? "#A0C43A" : "#C8F248", opacity: loading ? 0.8 : 1 }]}
                  onPress={handleReset}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnText}>{loading ? "Sending..." : "Send Reset Link"}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.successView}>
                <TouchableOpacity
                  style={[styles.btnPrimary, { backgroundColor: "#C8F248" }]}
                  onPress={() => router.back()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, flex: 1 },
  back: { marginBottom: 32, width: 40 },
  content: { flex: 1, justifyContent: "center", paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 40, gap: 12 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
  },
  sub: { 
    fontSize: 15, 
    color: "#9E9E9E", 
    textAlign: "center", 
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  form: { gap: 20 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  fieldGroup: { gap: 8 },
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
  btnPrimary: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
  successView: { marginTop: 10 },
});
