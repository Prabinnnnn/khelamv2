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
import { useGames } from "@/context/GamesContext";
import { useColors } from "@/hooks/useColors";

export default function HostDashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { hostedGames } = useGames();
  const [activeTab, setActiveTab] = React.useState<"Upcoming" | "Hosted" | "Cancelled">("Upcoming");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const stats = {
    upcoming: hostedGames.filter((g) => ["open", "full", "locked"].includes(g.status)).length,
    hosted: hostedGames.filter((g) => g.status === "completed").length,
    cancelled: hostedGames.filter((g) => g.status === "cancelled").length,
  };

  const filteredGames = hostedGames.filter((g) => {
    if (activeTab === "Upcoming") return ["open", "full", "locked"].includes(g.status);
    if (activeTab === "Hosted") return g.status === "completed";
    if (activeTab === "Cancelled") return g.status === "cancelled";
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Host Dashboard</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Manage your hosted games
          </Text>
        </View>
        <View style={[styles.hostBadge, { backgroundColor: "#22C55E22" }]}>
          <Ionicons name="shield-checkmark" size={14} color="#22C55E" />
          <Text style={styles.hostBadgeText}>Verified</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { value: stats.upcoming, label: "Upcoming", icon: "calendar-outline" },
          { value: stats.hosted, label: "Hosted", icon: "checkmark-done-outline" },
          { value: stats.cancelled, label: "Cancelled", icon: "close-circle-outline" },
        ].map((s, i) => (
          <View key={i} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name={s.icon as any} size={18} color="#C8F248" />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        {["Upcoming", "Hosted", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabBtn,
              activeTab === tab && { borderBottomColor: "#C8F248", borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.foreground : colors.mutedForeground },
                activeTab === tab && { fontWeight: "700" },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Game list */}
      <FlatList
        data={filteredGames}
        keyExtractor={(g) => g.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120, paddingTop: 16 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={null}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onPress={() => router.push(`/game/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="trophy-outline"
            title="No hosted games yet"
            subtitle="Create your first game to get started"
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: "#C8F248",
            bottom: insets.bottom + 20,
          },
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
  hostBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  hostBadgeText: { fontSize: 12, fontWeight: "700", color: "#22C55E" },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 16 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 16, fontWeight: "800" },
  statLabel: { fontSize: 10, textAlign: "center" },
  list: { paddingHorizontal: 20 },
  listHeader: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginTop: 8,
  },
  tabBtn: {
    paddingVertical: 12,
    marginRight: 24,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
