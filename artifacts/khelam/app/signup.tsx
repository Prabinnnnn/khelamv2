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

export default function SignupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else {
      router.push("/otp");
    }
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
          <TouchableOpacity onPress={() => (step > 1 ? setStep(1) : router.back())} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* Step indicator */}
          <View style={styles.stepRow}>
            {[1, 2].map((s) => (
              <View key={s} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: s <= step ? "#C8F248" : "#2E2E2E",
                      width: s === step ? 32 : 8,
                    },
                  ]}
                />
              </View>
            ))}
            <Text style={styles.stepText}>Step {step} of 2</Text>
          </View>

          <Text style={styles.heading}>
            {step === 1 ? "Create Account" : "Almost there!"}
          </Text>
          <Text style={styles.sub}>
            {step === 1
              ? "Join the Khelam community"
              : "Fill in the remaining details"}
          </Text>

          <View style={styles.form}>
            {step === 1 ? (
              <>
                {/* Avatar upload */}
                <View style={styles.avatarRow}>
                  <View style={[styles.avatarCircle, { backgroundColor: "#1A1A1A", borderColor: "#C8F248" + "60" }]}>
                    <Ionicons name="person-outline" size={32} color="#9E9E9E" />
                    <View style={[styles.cameraIcon, { backgroundColor: "#C8F248" }]}>
                      <Ionicons name="camera" size={14} color="#0D0D0D" />
                    </View>
                  </View>
                  <Text style={{ color: "#9E9E9E", fontSize: 13 }}>Add photo</Text>
                </View>

                <InputField
                  icon="person-outline"
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                />
                <InputField
                  icon="mail-outline"
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                <InputField
                  icon="call-outline"
                  placeholder="Phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </>
            ) : (
              <>
                <View style={[styles.inputWrap, { backgroundColor: "#1A1A1A", borderColor: "#2E2E2E" }]}>
                  <Ionicons name="lock-closed-outline" size={18} color="#9E9E9E" />
                  <TextInput
                    style={[styles.input, { color: "#FFF" }]}
                    placeholder="Create password"
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
                <InputField
                  icon="calendar-outline"
                  placeholder="Date of Birth (DD/MM/YYYY)"
                  value={dob}
                  onChangeText={setDob}
                />

                <View style={[styles.termsBox, { backgroundColor: "#1A1A1A", borderColor: "#2E2E2E" }]}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#C8F248" />
                  <Text style={{ color: "#9E9E9E", fontSize: 12, flex: 1 }}>
                    By signing up, you agree to our{" "}
                    <Text style={{ color: "#C8F248" }}>Terms of Service</Text> and{" "}
                    <Text style={{ color: "#C8F248" }}>Privacy Policy</Text>.
                  </Text>
                </View>
              </>
            )}

            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: "#C8F248" }]}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>
                {step === 2 ? "Verify OTP" : "Continue"}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#0D0D0D" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push("/login")} style={styles.loginRow}>
            <Text style={{ color: "#9E9E9E", fontSize: 14 }}>
              Already have an account?{" "}
              <Text style={{ color: "#C8F248", fontWeight: "700" }}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: TextInput["props"]["keyboardType"];
}) {
  return (
    <View style={[styles.inputWrap, { backgroundColor: "#1A1A1A", borderColor: "#2E2E2E" }]}>
      <Ionicons name={icon} size={18} color="#9E9E9E" />
      <TextInput
        style={[styles.input, { color: "#FFF" }]}
        placeholder={placeholder}
        placeholderTextColor="#9E9E9E"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, gap: 8 },
  back: { marginBottom: 20, width: 40 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  stepItem: {},
  stepDot: {
    height: 8,
    borderRadius: 100,
  },
  stepText: { color: "#9E9E9E", fontSize: 13, marginLeft: 8 },
  heading: { fontSize: 28, fontWeight: "800", color: "#FFF" },
  sub: { fontSize: 15, color: "#9E9E9E", marginBottom: 28 },
  form: { gap: 14 },
  avatarRow: { alignItems: "center", gap: 8, marginBottom: 8 },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
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
  termsBox: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  btnPrimary: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  btnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
  loginRow: { alignItems: "center", marginTop: 24 },
});
