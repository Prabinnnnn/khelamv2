import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

export default function BecomeHostScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [idType, setIdType] = useState("Citizenship");
  const [loading, setLoading] = useState(false);

  const status = user?.hostStatus ?? "not_applied";

  const handleApply = async () => {
    if (!fullName || !phone) {
      Alert.alert("Required", "Please fill in all required fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    await updateUser({ hostStatus: "pending" });
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.nav, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>
          Host Verification
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {status === "not_applied" && (
          <>
            <View style={styles.heroSection}>
              <View style={[styles.heroIcon, { backgroundColor: "#C8F24822" }]}>
                <Text style={{ fontSize: 52 }}>🏆</Text>
              </View>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>
                Host your own game
              </Text>
              <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
                Become a verified Khelam host and organize sports sessions for your community.
                Earn from every player who joins!
              </Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsRow}>
              {[
                { icon: "cash-outline", label: "Earn per game" },
                { icon: "people-outline", label: "Build community" },
                { icon: "star-outline", label: "Get verified" },
              ].map((b) => (
                <View
                  key={b.label}
                  style={[styles.benefit, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Ionicons name={b.icon as any} size={20} color="#1A1A1A" />
                  <Text style={[styles.benefitLabel, { color: colors.foreground }]}>{b.label}</Text>
                </View>
              ))}
            </View>

            {/* Form */}
            <Text style={[styles.formTitle, { color: colors.foreground }]}>
              Verification Details
            </Text>

            <View style={styles.form}>
              <Field
                label="Full Name"
                icon="person-outline"
                value={fullName}
                onChangeText={setFullName}
                colors={colors}
              />
              <Field
                label="Phone Number"
                icon="call-outline"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                colors={colors}
              />

              {/* ID Type Selector */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.mutedForeground }]}>ID Type</Text>
                <View style={styles.idRow}>
                  {["Citizenship", "Passport", "Driving License"].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.idChip,
                        {
                          backgroundColor: idType === t ? "#1A1A1A" : colors.card,
                          borderColor: idType === t ? "#1A1A1A" : colors.border,
                        },
                      ]}
                      onPress={() => setIdType(t)}
                    >
                      <Text
                        style={[
                          styles.idChipText,
                          { color: idType === t ? "#C8F248" : colors.mutedForeground },
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* ID Upload */}
              <TouchableOpacity
                style={[styles.uploadBtn, { backgroundColor: colors.card, borderColor: "#C8F24860", borderStyle: "dashed" }]}
              >
                <Ionicons name="cloud-upload-outline" size={28} color="#C8F248" />
                <Text style={[styles.uploadText, { color: colors.foreground }]}>
                  Upload {idType} Photo
                </Text>
                <Text style={[styles.uploadSub, { color: colors.mutedForeground }]}>
                  JPG, PNG or PDF up to 5MB
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: loading ? "#A0C43A" : "#C8F248" }]}
              onPress={handleApply}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>
                {loading ? "Submitting..." : "Start Verification"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {status === "pending" && (
          <View style={styles.statusSection}>
            <View style={[styles.statusIcon, { backgroundColor: "#FEF3C733" }]}>
              <Ionicons name="time-outline" size={48} color="#F59E0B" />
            </View>
            <Text style={[styles.statusTitle, { color: colors.foreground }]}>
              Verification in Progress
            </Text>
            <Text style={[styles.statusSub, { color: colors.mutedForeground }]}>
              We're reviewing your details. You'll receive a notification within 24-48 hours.
            </Text>
            <View style={[styles.submittedBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.submittedLabel, { color: colors.mutedForeground }]}>Submitted Details</Text>
              <Text style={[styles.submittedValue, { color: colors.foreground }]}>{user?.name}</Text>
              <Text style={[styles.submittedValue, { color: colors.foreground }]}>{user?.phone}</Text>
              <Text style={[styles.submittedValue, { color: colors.mutedForeground }]}>ID: Citizenship (Uploaded)</Text>
            </View>
          </View>
        )}

        {status === "verified" && (
          <View style={styles.statusSection}>
            <View style={[styles.statusIcon, { backgroundColor: "#DCFCE733" }]}>
              <Ionicons name="shield-checkmark" size={48} color="#22C55E" />
            </View>
            <Text style={[styles.statusTitle, { color: colors.foreground }]}>
              You're a Verified Host!
            </Text>
            <Text style={[styles.statusSub, { color: colors.mutedForeground }]}>
              You can now create and host games on Khelam.
            </Text>
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: "#C8F248" }]}
              onPress={() => router.push("/host/dashboard")}
            >
              <Text style={styles.applyBtnText}>Go to Host Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  icon,
  value,
  onChangeText,
  keyboardType,
  colors,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: TextInput["props"]["keyboardType"];
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name={icon} size={18} color={colors.mutedForeground} />
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor={colors.mutedForeground}
          placeholder={label}
        />
      </View>
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
  scroll: { paddingHorizontal: 20, gap: 20 },
  heroSection: { alignItems: "center", gap: 12, paddingTop: 16 },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  heroSub: { fontSize: 14, textAlign: "center", lineHeight: 22 },
  benefitsRow: { flexDirection: "row", gap: 10 },
  benefit: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  benefitLabel: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  formTitle: { fontSize: 18, fontWeight: "700" },
  form: { gap: 14 },
  fieldGroup: { gap: 6 },
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
  input: { flex: 1, fontSize: 15 },
  idRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  idChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
  },
  idChipText: { fontSize: 13, fontWeight: "600" },
  uploadBtn: {
    borderRadius: 14,
    borderWidth: 2,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  uploadText: { fontSize: 15, fontWeight: "600" },
  uploadSub: { fontSize: 12 },
  applyBtn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  applyBtnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
  statusSection: { alignItems: "center", gap: 16, paddingTop: 40 },
  statusIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  statusTitle: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  statusSub: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  submittedBox: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  submittedLabel: { fontSize: 12, marginBottom: 4 },
  submittedValue: { fontSize: 14, fontWeight: "600" },
});
