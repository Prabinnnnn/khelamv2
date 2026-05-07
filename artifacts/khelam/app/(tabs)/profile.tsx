import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

type MenuRow = { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; onPress?: () => void; danger?: boolean };

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!user) return null;

  const accountRows: MenuRow[] = [
    { icon: "person-outline", label: "Edit Profile" },
    { icon: "lock-closed-outline", label: "Change Password" },
    { icon: "notifications-outline", label: "Notifications", onPress: () => router.push("/notifications") },
  ];

  const supportRows: MenuRow[] = [
    { icon: "help-circle-outline", label: "Help & Support" },
    { icon: "document-text-outline", label: "Terms & Privacy" },
    { icon: "information-circle-outline", label: "About Khelam" },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace("/welcome");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + 12, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>Profile</Text>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: "#C8F24833" }]}>
            <Text style={styles.avatarInitial}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.foreground }]}>{user.name}</Text>
            <Text style={[styles.memberSince, { color: colors.mutedForeground }]}>
              Member since {user.memberSince}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.editBtn, { borderColor: colors.border }]}
          >
            <Ionicons name="pencil-outline" size={16} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[styles.statsRow]}>
          {[
            { value: user.gamesPlayed, label: "Games Played" },
            { value: user.gamesHosted, label: "Hosted" },
            { value: user.city, label: "City" },
          ].map((s, i) => (
            <View
              key={i}
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {s.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Wallet */}
        <View style={[styles.walletCard, { backgroundColor: "#1A1A1A" }]}>
          <View>
            <Text style={styles.walletLabel}>Khelam Wallet</Text>
            <Text style={styles.walletBalance}>NPR {user.walletBalance}</Text>
          </View>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: "#C8F248" }]}>
            <Ionicons name="add" size={18} color="#0D0D0D" />
            <Text style={styles.addBtnText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        {/* Host Section */}
        {user.hostStatus === "not_applied" ? (
          <TouchableOpacity
            style={[styles.hostCard, { backgroundColor: "#C8F24818", borderColor: "#C8F24860" }]}
            onPress={() => router.push("/host")}
            activeOpacity={0.85}
          >
            <View style={[styles.hostIcon, { backgroundColor: "#C8F24833" }]}>
              <Ionicons name="trophy-outline" size={24} color="#1A1A1A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.hostTitle, { color: colors.foreground }]}>Become a Host</Text>
              <Text style={[styles.hostSub, { color: colors.mutedForeground }]}>
                Organize games and earn
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        ) : user.hostStatus === "pending" ? (
          <View style={[styles.hostCard, { backgroundColor: "#FEF3C722", borderColor: "#F59E0B44" }]}>
            <Ionicons name="time-outline" size={22} color="#F59E0B" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.hostTitle, { color: colors.foreground }]}>Verification Pending</Text>
              <Text style={[styles.hostSub, { color: colors.mutedForeground }]}>
                We'll notify you within 24-48 hours
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.hostCard, { backgroundColor: "#DCFCE722", borderColor: "#22C55E44" }]}
            onPress={() => router.push("/host/dashboard")}
            activeOpacity={0.85}
          >
            <Ionicons name="shield-checkmark" size={22} color="#22C55E" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.hostTitle, { color: colors.foreground }]}>Verified Host</Text>
              <Text style={[styles.hostSub, { color: colors.mutedForeground }]}>
                Go to Host Dashboard
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}

        {/* Account Settings */}
        <MenuSection title="Account" rows={accountRows} colors={colors} />
        <MenuSection title="Support & Legal" rows={supportRows} colors={colors} />

        {/* Sign Out */}
        <TouchableOpacity
          style={[styles.signOut, { borderColor: "#FF4D4D22", backgroundColor: "#FF4D4D0A" }]}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={18} color="#FF4D4D" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function MenuSection({
  title,
  rows,
  colors,
}: {
  title: string;
  rows: MenuRow[];
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {rows.map((row, i) => (
          <TouchableOpacity
            key={row.label}
            style={[
              styles.menuRow,
              i < rows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            onPress={row.onPress}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.background }]}>
              <Ionicons name={row.icon} size={16} color={colors.foreground} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.foreground }]}>{row.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 16 },
  pageTitle: { fontSize: 26, fontWeight: "800", marginBottom: 4 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 26, fontWeight: "800", color: "#1A1A1A" },
  profileInfo: { flex: 1, gap: 3 },
  name: { fontSize: 18, fontWeight: "700" },
  memberSince: { fontSize: 13 },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 11, textAlign: "center" },
  walletCard: {
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletLabel: { fontSize: 13, color: "#9E9E9E", marginBottom: 4 },
  walletBalance: { fontSize: 22, fontWeight: "800", color: "#C8F248" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  addBtnText: { fontSize: 14, fontWeight: "700", color: "#0D0D0D" },
  hostCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  hostIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  hostTitle: { fontSize: 15, fontWeight: "700" },
  hostSub: { fontSize: 13 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginLeft: 4 },
  sectionCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  signOutText: { fontSize: 15, fontWeight: "700", color: "#FF4D4D" },
});
