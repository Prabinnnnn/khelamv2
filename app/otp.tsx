import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

export default function OTPScreen() {
  const insets = useSafeAreaInsets();
  const { verifyOtp, register } = useAuth();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Small delay for UI realism before hitting backend
      await new Promise((r) => setTimeout(r, 800));
      
      // Call verify-otp endpoint with email and otp as requested
      await verifyOtp(params.email as string, otp.join(""));
      
      router.replace("/city-select");
    } catch (err: any) {
      if (err.response?.data) {
        const backendErrors = err.response.data;
        const combinedMessage = Object.values(backendErrors).flat().join("\n");
        Alert.alert("Registration Error", combinedMessage + "\n\nPlease go back and fix these errors.");
      } else {
        Alert.alert("Verification Failed", err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      // Calling register again should trigger a new OTP according to your observation
      await register({
        name: params.name as string,
        email: params.email as string,
        phone: params.phone as string,
        password: params.password as string,
      });
      Alert.alert("Success", "OTP has been resent to your phone.");
    } catch (err: any) {
      // Even if it returns error, it might have sent the OTP
      Alert.alert("Resend OTP", "A new OTP has been requested.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "#0D0D0D", paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 },
      ]}
    >
      <StatusBar barStyle="light-content" />
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.iconWrap}>
        <Ionicons name="phone-portrait-outline" size={40} color="#C8F248" />
      </View>

      <Text style={styles.heading}>Verify your number</Text>
      <Text style={styles.sub}>
        Enter the 6-digit code sent to your phone
      </Text>

      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(r) => { inputs.current[i] = r; }}
            style={[
              styles.otpInput,
              {
                backgroundColor: "#1A1A1A",
                borderColor: digit ? "#C8F248" : "#2E2E2E",
                color: "#FFF",
              },
            ]}
            value={digit}
            onChangeText={(v) => handleChange(v.replace(/[^0-9]/g, ""), i)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleResend}>
        <Text style={[styles.resend, { color: "#9E9E9E" }]}>
          Didn't receive?{" "}
          <Text style={{ color: "#C8F248", fontWeight: "700" }}>Resend OTP</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: otp.every((d) => d) ? "#C8F248" : "#2E2E2E",
          },
        ]}
        onPress={handleVerify}
        disabled={!otp.every((d) => d) || loading}
        activeOpacity={0.85}
      >
        <Text
          style={[
            styles.btnText,
            { color: otp.every((d) => d) ? "#0D0D0D" : "#9E9E9E" },
          ]}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, gap: 20 },
  back: { width: 40 },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#C8F24822",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  heading: { fontSize: 28, fontWeight: "800", color: "#FFF", textAlign: "center" },
  sub: { fontSize: 15, color: "#9E9E9E", textAlign: "center" },
  otpRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginTop: 12,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 22,
    fontWeight: "700",
  },
  resend: { textAlign: "center", fontSize: 14 },
  btn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { fontSize: 16, fontWeight: "800" },
});
