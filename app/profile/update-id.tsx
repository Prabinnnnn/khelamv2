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

export default function UpdateIdScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [newId, setNewId] = useState("");

  const handleUpdate = async () => {
    if (!newId.trim()) {
      Alert.alert("Required", "Please enter a new Host ID.");
      return;
    }

    if (newId.length < 3) {
      Alert.alert("Invalid", "Host ID must be at least 3 characters long.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    Alert.alert("Success", `Your Host ID has been updated to "${newId}".`, [
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
          <Text style={[styles.navTitle, { color: colors.foreground }]}>Update ID</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Update Your Host ID
          </Text>

          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            Your Host ID is a unique identifier used by other players to recognize you as a host. Choose something memorable and professional.
          </Text>

          <Text style={[styles.label, { color: colors.foreground }]}>Current ID</Text>
          <View style={[styles.disabledInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.mutedForeground} />
            <Text style={[styles.disabledText, { color: colors.mutedForeground }]}>
              {user.hostId || "Not set"}
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.foreground }]}>New Host ID</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="at-outline" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Enter new Host ID"
              placeholderTextColor={colors.mutedForeground}
              value={newId}
              onChangeText={setNewId}
              maxLength={20}
            />
            <Text style={[styles.counter, { color: colors.mutedForeground }]}>
              {newId.length}/20
            </Text>
          </View>

          <Text style={[styles.info, { color: colors.mutedForeground }]}>
            • Must be 3-20 characters{"\n"}
            • Can contain letters, numbers, and underscores{"\n"}
            • Cannot be changed for 30 days after update
          </Text>

          <TouchableOpacity
            style={[styles.updateBtn, { backgroundColor: loading ? "#A0C43A" : "#C8F248" }]}
            onPress={handleUpdate}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.updateBtnText}>{loading ? "Updating..." : "Update ID"}</Text>
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
  disabledInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    marginBottom: 16,
  },
  disabledText: { flex: 1, fontSize: 14 },
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
  counter: { fontSize: 12, fontWeight: "600" },
  info: { fontSize: 12, lineHeight: 18, marginBottom: 24 },
  updateBtn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 8,
  },
  updateBtnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
});
