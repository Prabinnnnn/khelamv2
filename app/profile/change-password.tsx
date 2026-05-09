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

import { useColors } from "@/hooks/useColors";

export default function ChangePasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Required", "Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Invalid", "New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    Alert.alert("Success", "Your password has been changed.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.nav, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: colors.card }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: colors.foreground }]}>Change Password</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Update Your Password
          </Text>

          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            Enter your current password and choose a new, strong password.
          </Text>

          <Text style={[styles.label, { color: colors.foreground }]}>Current Password</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Current password"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              <Ionicons
                name={showCurrent ? "eye-outline" : "eye-off-outline"}
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: colors.foreground }]}>New Password</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="New password"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showNew}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Ionicons
                name={showNew ? "eye-outline" : "eye-off-outline"}
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: colors.foreground }]}>Confirm Password</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Confirm password"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? "eye-outline" : "eye-off-outline"}
                size={16}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.info, { color: colors.mutedForeground }]}>
            • Password must be at least 8 characters long{"\n"}
            • Use a mix of letters, numbers, and symbols for security{"\n"}
            • You will be logged out after changing your password
          </Text>

          <TouchableOpacity
            style={[styles.changeBtn, { backgroundColor: loading ? "#A0C43A" : "#C8F248" }]}
            onPress={handleChangePassword}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.changeBtnText}>{loading ? "Updating..." : "Change Password"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: { flex: 1, fontSize: 18, fontWeight: "700", textAlign: "center" },
  scroll: { paddingHorizontal: 20, gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginTop: 8 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 14 },
  info: { fontSize: 12, lineHeight: 18, marginBottom: 24 },
  changeBtn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 8,
  },
  changeBtnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
});
