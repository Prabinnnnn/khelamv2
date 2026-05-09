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
import { useColors } from "@/hooks/useColors";

export default function EditDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleSave = async () => {
    if (!email || !phone || !address) {
      Alert.alert("Required", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    Alert.alert("Success", "Your details have been updated.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  if (!user) return null;

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
          <Text style={[styles.navTitle, { color: colors.foreground }]}>Edit Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Contact Information
          </Text>

          <Text style={[styles.label, { color: colors.foreground }]}>Email</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Email"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <Text style={[styles.label, { color: colors.foreground }]}>Phone</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="call-outline" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Phone number"
              placeholderTextColor={colors.mutedForeground}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={[styles.label, { color: colors.foreground }]}>Address</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Address"
              placeholderTextColor={colors.mutedForeground}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <Text style={[styles.info, { color: colors.mutedForeground }]}>
            Photo upload will be available in the next update.
          </Text>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: loading ? "#A0C43A" : "#C8F248" }]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>{loading ? "Saving..." : "Save Changes"}</Text>
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
  info: { fontSize: 12, marginBottom: 24 },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
});
