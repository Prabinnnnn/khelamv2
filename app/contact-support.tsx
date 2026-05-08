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

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function ContactSupportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" />
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: "#C8F24820" }]}>
            <Ionicons name="checkmark-circle" size={80} color="#C8F248" />
          </View>
          <Text style={[styles.heading, { color: colors.foreground }]}>Message Sent!</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            We've received your inquiry and will get back to you within 24 hours.
          </Text>
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: "#C8F248", width: "100%" }]}
            onPress={() => router.back()}
          >
            <Text style={styles.btnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Contact Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.pageSub, { color: colors.mutedForeground }]}>
            Tell us what's on your mind. We'll get back to you as soon as possible.
          </Text>

          <View style={styles.form}>
            {/* Read-only fields */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Full Name</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border, opacity: 0.7 }]}>
                <Ionicons name="person-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.mutedForeground }]}
                  value={user?.name || "Guest User"}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Email</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border, opacity: 0.7 }]}>
                <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.mutedForeground }]}
                  value={user?.email || "guest@example.com"}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Phone</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border, opacity: 0.7 }]}>
                <Ionicons name="call-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.mutedForeground }]}
                  value={user?.phone || "+977 98XXXXXXX"}
                  editable={false}
                />
              </View>
            </View>

            {/* Editable field */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Message</Text>
              <View style={[styles.inputWrap, styles.messageInput, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.foreground, height: 120, textAlignVertical: "top" }]}
                  placeholder="Describe your issue or feedback..."
                  placeholderTextColor={colors.mutedForeground}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: loading ? colors.primary + "80" : colors.primary, marginTop: 12 }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={[styles.btnText, { color: colors.primaryForeground }]}>
                {loading ? "Sending..." : "Submit Inquiry"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  scroll: { padding: 24 },
  pageSub: { fontSize: 15, lineHeight: 22, marginBottom: 32 },
  form: { gap: 20 },
  fieldGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: "600" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  messageInput: {
    alignItems: "flex-start",
    paddingTop: 12,
  },
  input: { flex: 1, fontSize: 15 },
  btnPrimary: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  btnText: { fontSize: 16, fontWeight: "800" },
  errorText: { color: "#FF4D4D", fontSize: 12, marginTop: 4 },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heading: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  sub: { fontSize: 16, textAlign: "center", lineHeight: 24, marginBottom: 24 },
});
