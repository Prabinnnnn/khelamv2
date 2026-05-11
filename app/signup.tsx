import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

import { useAuth } from "@/context/AuthContext";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!dob.trim()) e.dob = "Date of birth is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (validateStep1()) {
        setErrors({});
        setStep(2);
      }
    } else {
      if (validateStep2()) {
        setLoading(true);
        try {
          // Call register to trigger OTP creation on backend
          await register({ name, email, phone, password });
          
          // Navigation logic: Always move to OTP screen if call succeeded
          // We assume the backend sends an OTP and we need to verify it
          router.push({
            pathname: "/otp",
            params: { name, email, phone, password }
          });
        } catch (err: any) {
          // If the backend returns a 400 but it mentions OTP, we still go to OTP screen
          const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
          if (errorMsg.toLowerCase().includes("otp")) {
             router.push({
              pathname: "/otp",
              params: { name, email, phone, password }
            });
          } else {
            const displayMsg = err.response?.data ? Object.values(err.response.data).flat().join("\n") : err.message;
            Alert.alert("Registration Error", displayMsg || "Failed to start registration.");
          }
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

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
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => (step > 1 ? setStep(1) : router.back())}
            style={styles.back}
          >
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
              : "Set your password and birthday"}
          </Text>

          <View style={styles.form}>
            {step === 1 ? (
              <>
                {/* Avatar upload — optional */}
                <View style={styles.avatarRow}>
                  <View
                    style={[
                      styles.avatarCircle,
                      { backgroundColor: "#1A1A1A", borderColor: "#C8F24860" },
                    ]}
                  >
                    <Ionicons name="person-outline" size={32} color="#9E9E9E" />
                    <View style={[styles.cameraIcon, { backgroundColor: "#C8F248" }]}>
                      <Ionicons name="camera" size={14} color="#0D0D0D" />
                    </View>
                  </View>
                  <Text style={{ color: "#9E9E9E", fontSize: 13 }}>
                    Add photo{" "}
                    <Text style={{ color: "#4E4E4E" }}>(optional)</Text>
                  </Text>
                </View>

                <InputField
                  icon="person-outline"
                  placeholder="Full Name *"
                  value={name}
                  onChangeText={(v) => { setName(v); setErrors((e) => ({ ...e, name: "" })); }}
                  error={errors.name}
                />
                <InputField
                  icon="mail-outline"
                  placeholder="Email address *"
                  value={email}
                  onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: "" })); }}
                  keyboardType="email-address"
                  error={errors.email}
                />
                <InputField
                  icon="call-outline"
                  placeholder="Phone number *"
                  value={phone}
                  onChangeText={(v) => { setPhone(v); setErrors((e) => ({ ...e, phone: "" })); }}
                  keyboardType="phone-pad"
                  error={errors.phone}
                />
              </>
            ) : (
              <>
                {/* Password */}
                <View style={styles.fieldGroup}>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        backgroundColor: "#1A1A1A",
                        borderColor: errors.password ? "#FF4D4D" : "#2E2E2E",
                      },
                    ]}
                  >
                    <Ionicons name="lock-closed-outline" size={18} color="#9E9E9E" />
                    <TextInput
                      style={[styles.input, { color: "#FFF" }]}
                      placeholder="Create password *"
                      placeholderTextColor="#9E9E9E"
                      value={password}
                      onChangeText={(v) => {
                        setPassword(v);
                        setErrors((e) => ({ ...e, password: "" }));
                      }}
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
                  {errors.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  ) : null}
                </View>

                {/* Confirm Password */}
                <View style={styles.fieldGroup}>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        backgroundColor: "#1A1A1A",
                        borderColor: errors.confirmPassword
                          ? "#FF4D4D"
                          : passwordsMatch
                          ? "#22C55E"
                          : "#2E2E2E",
                      },
                    ]}
                  >
                    <Ionicons name="lock-closed-outline" size={18} color="#9E9E9E" />
                    <TextInput
                      style={[styles.input, { color: "#FFF" }]}
                      placeholder="Confirm password *"
                      placeholderTextColor="#9E9E9E"
                      value={confirmPassword}
                      onChangeText={(v) => {
                        setConfirmPassword(v);
                        setErrors((e) => ({ ...e, confirmPassword: "" }));
                      }}
                      secureTextEntry={!showConfirm}
                    />
                    {passwordsMatch ? (
                      <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                    ) : (
                      <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                        <Ionicons
                          name={showConfirm ? "eye-off-outline" : "eye-outline"}
                          size={18}
                          color="#9E9E9E"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  ) : passwordsMismatch ? (
                    <Text style={styles.errorText}>Passwords do not match</Text>
                  ) : null}
                </View>

                <InputField
                  icon="calendar-outline"
                  placeholder="Date of Birth (DD/MM/YYYY) *"
                  value={dob}
                  onChangeText={(v) => { setDob(v); setErrors((e) => ({ ...e, dob: "" })); }}
                  keyboardType="number-pad"
                  error={errors.dob}
                />

                <View
                  style={[styles.termsBox, { backgroundColor: "#1A1A1A", borderColor: "#2E2E2E" }]}
                >
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
              style={[styles.btnPrimary, { backgroundColor: loading ? "#A0C43A" : "#C8F248", opacity: loading ? 0.7 : 1 }]}
              onPress={handleContinue}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>
                {loading ? "Creating account..." : step === 2 ? "Register" : "Continue"}
              </Text>
              {!loading && <Ionicons name="arrow-forward" size={18} color="#0D0D0D" />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.loginRow}
          >
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
  error,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: TextInput["props"]["keyboardType"];
  error?: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: "#1A1A1A",
            borderColor: error ? "#FF4D4D" : "#2E2E2E",
          },
        ]}
      >
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  stepDot: { height: 8, borderRadius: 100 },
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
  fieldGroup: { gap: 5 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  errorText: { fontSize: 12, color: "#FF4D4D", marginLeft: 4 },
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
