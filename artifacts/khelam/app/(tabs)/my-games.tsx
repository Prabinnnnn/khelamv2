import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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

const PAST_MOCK = [
  {
    id: "past1",
    title: "Futsal Friday Fiesta",
    sport: "Futsal",
    venue: "Sports Hub",
    address: "Thamel, Kathmandu",
    date: "2026-04-30",
    dateLabel: "Apr 30",
    time: "06:00 PM",
    duration: "60 min",
    format: "5 vs 5",
    slots: 10,
    filledSlots: 10,
    price: 500,
    isIndoor: true,
    hostId: "host_1",
    hostName: "Rohan M.",
    hostAvatar: "",
    hostBio: "",
    image: "",
    status: "full" as const,
    rules: "",
    notes: "",
    kitToBring: [],
    players: [],
    city: "Kathmandu",
  },
];

export default function MyGamesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { games, joinedGameIds } = useGames();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const upcoming = games.filter((g) => joinedGameIds.includes(g.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>My Games</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
        {(["upcoming", "past"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.tab,
              {
                borderBottomWidth: tab === t ? 2.5 : 0,
                borderBottomColor: "#1A1A1A",
              },
            ]}
            onPress={() => setTab(t)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: tab === t ? colors.foreground : colors.mutedForeground,
                  fontWeight: tab === t ? "700" : "500",
                },
              ]}
            >
              {t === "upcoming" ? "Upcoming" : "Past"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "upcoming" ? (
        upcoming.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No upcoming games"
            subtitle="Join a game from Discover to see it here"
            action={{ label: "Discover Games", onPress: () => router.push("/(tabs)/discover") }}
          />
        ) : (
          <FlatList
            data={upcoming}
            keyExtractor={(g) => g.id}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: insets.bottom + 100 },
            ]}
            renderItem={({ item }) => (
              <GameCard
                game={item}
                isJoined
                onPress={() => router.push(`/game/${item.id}`)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        <FlatList
          data={PAST_MOCK}
          keyExtractor={(g) => g.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 100 },
          ]}
          renderItem={({ item }) => (
            <GameCard
              game={item}
              isPast
              onPress={() => {}}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="time-outline"
              title="No past games yet"
              subtitle="Your completed games will appear here"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: "800" },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginRight: 24,
  },
  tabText: { fontSize: 15 },
  list: { paddingHorizontal: 20 },
});
