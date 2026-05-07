import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { GameCard } from "@/components/GameCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useAuth } from "@/context/AuthContext";
import { useGames } from "@/context/GamesContext";
import { useColors } from "@/hooks/useColors";

const SPORTS = ["All", "Futsal", "Football", "Cricket", "Basketball", "Badminton", "E-Sports"];

const SPORT_EMOJIS: Record<string, string> = {
  All: "🏆",
  Futsal: "⚽",
  Football: "🏈",
  Cricket: "🏏",
  Basketball: "🏀",
  Badminton: "🏸",
  "E-Sports": "🎮",
};

export default function DiscoverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity, selectedSport, setSelectedSport } = useAuth();
  const { games, joinedGameIds } = useGames();

  const [activeFilter, setActiveFilter] = useState("All");
  const [loading] = useState(false);
  const [showNotifBadge] = useState(true);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = useMemo(() => {
    if (activeFilter === "All") return games;
    return games.filter((g) => g.sport === activeFilter);
  }, [games, activeFilter]);

  // Group by dateLabel
  const grouped = useMemo(() => {
    const map: Record<string, typeof games> = {};
    filtered.forEach((g) => {
      if (!map[g.dateLabel]) map[g.dateLabel] = [];
      map[g.dateLabel].push(g);
    });
    return map;
  }, [filtered]);

  const sections = Object.entries(grouped);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: topPad + 12, backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.cityPill}>
          <Ionicons name="location" size={16} color={colors.primary === "#C8F248" ? "#C8F248" : colors.primary} style={{ color: "#1A1A1A" }} />
          <Ionicons name="location" size={16} color="#1A1A1A" />
          <Text style={[styles.cityText, { color: colors.foreground }]}>{selectedCity}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.mutedForeground} />
        </TouchableOpacity>
        <View style={styles.topRight}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
            {showNotifBadge && (
              <View style={[styles.notifDot, { backgroundColor: "#FF4D4D" }]} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Sport Filter Chips */}
      <View style={[styles.chipRow, { backgroundColor: colors.background }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {SPORTS.map((sport) => {
            const active = activeFilter === sport;
            return (
              <TouchableOpacity
                key={sport}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? "#1A1A1A" : colors.card,
                    borderColor: active ? "#1A1A1A" : colors.border,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveFilter(sport);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.chipEmoji}>{SPORT_EMOJIS[sport]}</Text>
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? "#C8F248" : colors.mutedForeground },
                  ]}
                >
                  {sport}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Pills */}
      <View style={[styles.filterRow, { backgroundColor: colors.background }]}>
        {["Date", "Time of Day", "Spots"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, { color: colors.mutedForeground }]}>{f}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Game List */}
      {loading ? (
        <View style={styles.listContent}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </View>
      ) : sections.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No games found"
          subtitle="Try a different sport or check back later"
        />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={([label]) => label}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: [label, sectionGames] }) => (
            <View>
              <View style={styles.dayHeader}>
                <View style={[styles.dayLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>
                  {label}
                </Text>
                <View style={[styles.dayLine, { backgroundColor: colors.border }]} />
              </View>
              {sectionGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  isJoined={joinedGameIds.includes(game.id)}
                  onPress={() => router.push(`/game/${game.id}`)}
                />
              ))}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  cityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityText: {
    fontSize: 18,
    fontWeight: "800",
  },
  topRight: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipRow: { paddingBottom: 8 },
  chipScroll: { paddingHorizontal: 20, gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
  },
  chipEmoji: { fontSize: 14 },
  chipText: { fontSize: 13, fontWeight: "600" },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
  },
  filterText: { fontSize: 12, fontWeight: "600" },
  listContent: { paddingHorizontal: 20, paddingTop: 4 },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 14,
  },
  dayLine: { flex: 1, height: 1 },
  dayLabel: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
});
