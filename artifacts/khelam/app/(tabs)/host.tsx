import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { GameCard } from "@/components/GameCard";
import { useAuth } from "@/context/AuthContext";
import { useGames } from "@/context/GamesContext";
import { useColors } from "@/hooks/useColors";

export default function HostTab() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { hostedGames } = useGames();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const status = user?.hostStatus ?? "not_applied";

  if (status === "not_applied" || status === "pending") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={[styles.header, { paddingTop: topPad + 12 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Host</Text>
        </View>
        <View style={styles.centerContent}>
          {status === "not_applied" ? (
            <>
              <View style={[styles.heroIcon, { backgroundColor: "#C8F24820" }]}>
                <Text style={{ fontSize: 56 }}>🏆</Text>
              </View>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>
                Become a Host
              </Text>
              <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
                Organize games, build your community, and earn on every player
                who joins your sessions.
              </Text>

              <View style={styles.benefitsRow}>
                {[
                  { icon: "cash-outline" as const, label: "Earn per game" },
                  { icon: "people-outline" as const, label: "Build community" },
                  { icon: "star-outline" as const, label: "Get verified" },
                ].map((b) => (
                  <View
                    key={b.label}
                    style={[
                      styles.benefit,
                      { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                  >
                    <Ionicons name={b.icon} size={20} color="#1A1A1A" />
                    <Text style={[styles.benefitLabel, { color: colors.foreground }]}>
                      {b.label}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.applyBtn, { backgroundColor: "#C8F248" }]}
                onPress={() => router.push("/host")}
                activeOpacity={0.85}
              >
                <Ionicons name="shield-checkmark-outline" size={18} color="#0D0D0D" />
                <Text style={styles.applyBtnText}>Apply to Host</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={[styles.heroIcon, { backgroundColor: "#FEF3C722" }]}>
                <Ionicons name="time-outline" size={52} color="#F59E0B" />
              </View>
              <Text style={[styles.heroTitle, { color: colors.foreground }]}>
                Verification Pending
              </Text>
              <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
                We're reviewing your application. You'll be notified within
                24-48 hours once your account is verified.
              </Text>
              <View
                style={[
                  styles.pendingBadge,
                  { backgroundColor: "#FEF3C722", borderColor: "#F59E0B44" },
                ]}
              >
                <Ionicons name="hourglass-outline" size={16} color="#F59E0B" />
                <Text style={{ color: "#D97706", fontSize: 14, fontWeight: "600" }}>
                  Under Review
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Host Dashboard</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Your games & earnings
          </Text>
        </View>
        <View style={[styles.verifiedBadge, { backgroundColor: "#22C55E22" }]}>
          <Ionicons name="shield-checkmark" size={14} color="#22C55E" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: hostedGames.length, label: "Games", icon: "trophy-outline" as const },
          {
            value: hostedGames.reduce((s, g) => s + g.filledSlots, 0),
            label: "Players",
            icon: "people-outline" as const,
          },
          {
            value: `NPR ${hostedGames.reduce((s, g) => s + g.price * g.filledSlots, 0)}`,
            label: "Earned",
            icon: "cash-outline" as const,
          },
        ].map((s, i) => (
          <View
            key={i}
            style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name={s.icon} size={16} color="#1A1A1A" />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={hostedGames}
        keyExtractor={(g) => g.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={[styles.listHeader, { color: colors.mutedForeground }]}>
            {hostedGames.length > 0 ? `${hostedGames.length} Hosted Games` : "No hosted games yet"}
          </Text>
        }
        renderItem={({ item }) => (
          <View>
            <GameCard
              game={item}
              onPress={() => router.push(`/game/${item.id}`)}
            />
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => router.push(`/host/create?editId=${item.id}`)}
              >
                <Ionicons name="pencil-outline" size={14} color={colors.foreground} />
                <Text style={[styles.actionText, { color: colors.foreground }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="people-outline" size={14} color={colors.foreground} />
                <Text style={[styles.actionText, { color: colors.foreground }]}>
                  {item.filledSlots}/{item.slots} Players
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="trophy-outline"
            title="No hosted games yet"
            subtitle="Create your first game to start earning"
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: "#C8F248", bottom: insets.bottom + 80 },
        ]}
        onPress={() => router.push("/host/create")}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#0D0D0D" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: "800" },
  subtitle: { fontSize: 14, marginTop: 2 },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  verifiedText: { fontSize: 12, fontWeight: "700", color: "#22C55E" },
  centerContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 40,
    gap: 16,
  },
  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  heroTitle: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  heroSub: { fontSize: 15, textAlign: "center", lineHeight: 23 },
  benefitsRow: { flexDirection: "row", gap: 10, width: "100%", marginTop: 8 },
  benefit: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  benefitLabel: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
  },
  applyBtnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    marginTop: 8,
  },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 15, fontWeight: "800" },
  statLabel: { fontSize: 10, textAlign: "center" },
  list: { paddingHorizontal: 20 },
  listHeader: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  actionRow: { flexDirection: "row", gap: 10, marginTop: -4, marginBottom: 16 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
  },
  actionText: { fontSize: 13, fontWeight: "600" },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
