import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
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

const CITIES = [
  { name: "Kathmandu", emoji: "🏙️" },
  { name: "Pokhara", emoji: "⛰️" },
  { name: "Lalitpur", emoji: "🏛️" },
  { name: "Bhaktapur", emoji: "🏯" },
  { name: "Chitwan", emoji: "🌿" },
  { name: "Butwal", emoji: "🌆" },
  { name: "Biratnagar", emoji: "🏭" },
  { name: "Birgunj", emoji: "🌉" },
];

const DATE_OPTIONS = ["Today", "Tomorrow", "This Weekend", "This Week", "Next Week"];
const TIME_OPTIONS = ["Morning (6–10 AM)", "Afternoon (10 AM–3 PM)", "Evening (3–7 PM)", "Night (7 PM+)"];
const SPOTS_OPTIONS = ["Open Spots", "Closed / Full"];

type FilterModal = "date" | "time" | "spots" | "city" | null;

export default function DiscoverScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedCity, setSelectedCity } = useAuth();
  const { allGames, joinedGameIds } = useGames();

  const [activeFilter, setActiveFilter] = useState("All");
  const [loading] = useState(false);
  const [showNotifBadge] = useState(true);

  const [activeModal, setActiveModal] = useState<FilterModal>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string | null>(null);
  const [spotsFilter, setSpotsFilter] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  // Filter games: first by city, then by sport and other filters
  const filtered = useMemo(() => {
    let result = allGames.filter((g) => g.city === selectedCity);
    if (activeFilter !== "All") {
      result = result.filter((g) => g.sport === activeFilter);
    }
    if (spotsFilter === "Open Spots") {
      result = result.filter((g) => g.status === "open");
    } else if (spotsFilter === "Closed / Full") {
      result = result.filter((g) => g.status === "full" || g.status === "locked");
    }
    return result;
  }, [allGames, selectedCity, activeFilter, spotsFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof allGames> = {};
    filtered.forEach((g) => {
      if (!map[g.dateLabel]) map[g.dateLabel] = [];
      map[g.dateLabel].push(g);
    });
    return map;
  }, [filtered]);

  const sections = Object.entries(grouped);
  const gameCount = filtered.length;

  const openModal = (type: FilterModal) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveModal(type);
  };

  const handleCitySelect = (city: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCity(city);
    setActiveFilter("All");
    setDateFilter(null);
    setTimeFilter(null);
    setSpotsFilter(null);
    setActiveModal(null);
  };

  const activeFilterCount = [dateFilter, timeFilter, spotsFilter].filter(Boolean).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: topPad + 12, backgroundColor: colors.background }]}>
        {/* City picker trigger */}
        <TouchableOpacity
          style={styles.cityPill}
          onPress={() => openModal("city")}
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={16} color="#1A1A1A" />
          <Text style={[styles.cityText, { color: colors.foreground }]}>{selectedCity}</Text>
          <View style={[styles.chevronWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="chevron-down" size={14} color={colors.mutedForeground} />
          </View>
        </TouchableOpacity>

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

      {/* Game count for this city */}
      <View style={[styles.countRow, { backgroundColor: colors.background }]}>
        <Text style={[styles.countText, { color: colors.mutedForeground }]}>
          {gameCount} {gameCount === 1 ? "game" : "games"} in {selectedCity}
        </Text>
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
                <Text style={[styles.chipText, { color: active ? "#C8F248" : colors.mutedForeground }]}>
                  {sport}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Pills */}
      <View style={[styles.filterRow, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.filterPill, { backgroundColor: dateFilter ? "#1A1A1A" : colors.card, borderColor: dateFilter ? "#1A1A1A" : colors.border }]}
          onPress={() => openModal("date")}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={13} color={dateFilter ? "#C8F248" : colors.mutedForeground} />
          <Text style={[styles.filterText, { color: dateFilter ? "#C8F248" : colors.mutedForeground }]}>
            {dateFilter ?? "Date"}
          </Text>
          <Ionicons name="chevron-down" size={12} color={dateFilter ? "#C8F248" : colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, { backgroundColor: timeFilter ? "#1A1A1A" : colors.card, borderColor: timeFilter ? "#1A1A1A" : colors.border }]}
          onPress={() => openModal("time")}
          activeOpacity={0.8}
        >
          <Ionicons name="time-outline" size={13} color={timeFilter ? "#C8F248" : colors.mutedForeground} />
          <Text style={[styles.filterText, { color: timeFilter ? "#C8F248" : colors.mutedForeground }]}>
            {timeFilter ? timeFilter.split(" ")[0] : "Time"}
          </Text>
          <Ionicons name="chevron-down" size={12} color={timeFilter ? "#C8F248" : colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterPill, { backgroundColor: spotsFilter ? "#1A1A1A" : colors.card, borderColor: spotsFilter ? "#1A1A1A" : colors.border }]}
          onPress={() => openModal("spots")}
          activeOpacity={0.8}
        >
          <Ionicons name="people-outline" size={13} color={spotsFilter ? "#C8F248" : colors.mutedForeground} />
          <Text style={[styles.filterText, { color: spotsFilter ? "#C8F248" : colors.mutedForeground }]}>
            {spotsFilter === "Open Spots" ? "Open" : spotsFilter === "Closed / Full" ? "Full" : "Spots"}
          </Text>
          <Ionicons name="chevron-down" size={12} color={spotsFilter ? "#C8F248" : colors.mutedForeground} />
        </TouchableOpacity>

        {activeFilterCount > 0 && (
          <TouchableOpacity
            style={[styles.filterPill, { backgroundColor: "#FF4D4D11", borderColor: "#FF4D4D33" }]}
            onPress={() => { setDateFilter(null); setTimeFilter(null); setSpotsFilter(null); }}
          >
            <Ionicons name="close-circle" size={14} color="#FF4D4D" />
            <Text style={[styles.filterText, { color: "#FF4D4D" }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Game List */}
      {loading ? (
        <View style={styles.listContent}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </View>
      ) : sections.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title={`No games in ${selectedCity}`}
          subtitle="Try a different city or adjust your filters"
        />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={([label]) => label}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: [label, sectionGames] }) => (
            <View>
              <View style={styles.dayHeader}>
                <View style={[styles.dayLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>{label}</Text>
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

      {/* City Picker Modal */}
      <Modal
        visible={activeModal === "city"}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.sheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}
          >
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Choose City</Text>
            <Text style={[styles.sheetSub, { color: colors.mutedForeground }]}>
              Games will update for the selected city
            </Text>

            <View style={styles.cityGrid}>
              {CITIES.map((city) => {
                const isActive = selectedCity === city.name;
                const count = allGames.filter((g) => g.city === city.name).length;
                return (
                  <TouchableOpacity
                    key={city.name}
                    style={[
                      styles.cityCard,
                      {
                        backgroundColor: isActive ? "#C8F24818" : colors.card,
                        borderColor: isActive ? "#C8F248" : colors.border,
                        borderWidth: isActive ? 2 : 1,
                      },
                    ]}
                    onPress={() => handleCitySelect(city.name)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cityEmoji}>{city.emoji}</Text>
                    <Text
                      style={[
                        styles.cityName,
                        { color: isActive ? "#1A1A1A" : colors.foreground, fontWeight: isActive ? "800" : "600" },
                      ]}
                    >
                      {city.name}
                    </Text>
                    <View style={[styles.cityCountBadge, { backgroundColor: isActive ? "#C8F24840" : colors.background }]}>
                      <Text style={[styles.cityCount, { color: isActive ? "#1A1A1A" : colors.mutedForeground }]}>
                        {count} games
                      </Text>
                    </View>
                    {isActive && (
                      <View style={[styles.checkIcon, { backgroundColor: "#C8F248" }]}>
                        <Ionicons name="checkmark" size={10} color="#0D0D0D" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Date Filter Modal */}
      {activeModal === "date" && (
        <FilterSheet
          title="Filter by Date"
          options={DATE_OPTIONS}
          selected={dateFilter}
          onSelect={setDateFilter}
          onClose={() => setActiveModal(null)}
          colors={colors}
          insets={insets}
        />
      )}

      {/* Time Filter Modal */}
      {activeModal === "time" && (
        <FilterSheet
          title="Filter by Time of Day"
          options={TIME_OPTIONS}
          selected={timeFilter}
          onSelect={setTimeFilter}
          onClose={() => setActiveModal(null)}
          colors={colors}
          insets={insets}
        />
      )}

      {/* Spots Filter Modal */}
      {activeModal === "spots" && (
        <FilterSheet
          title="Filter by Availability"
          options={SPOTS_OPTIONS}
          selected={spotsFilter}
          onSelect={setSpotsFilter}
          onClose={() => setActiveModal(null)}
          colors={colors}
          insets={insets}
        />
      )}
    </View>
  );
}

function FilterSheet({
  title,
  options,
  selected,
  onSelect,
  onClose,
  colors,
  insets,
}: {
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
  onClose: () => void;
  colors: ReturnType<typeof useColors>;
  insets: ReturnType<typeof useSafeAreaInsets>;
}) {
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}
        >
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>{title}</Text>
          {options.map((opt) => {
            const isActive = selected === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.sheetOption,
                  {
                    backgroundColor: isActive ? "#C8F24820" : colors.card,
                    borderColor: isActive ? "#C8F248" : colors.border,
                  },
                ]}
                onPress={() => {
                  onSelect(isActive ? null : opt);
                  onClose();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={[styles.sheetOptionText, { color: isActive ? "#1A1A1A" : colors.foreground, fontWeight: isActive ? "700" : "500" }]}>
                  {opt}
                </Text>
                {isActive && <Ionicons name="checkmark-circle" size={20} color="#1A1A1A" />}
              </TouchableOpacity>
            );
          })}
          {selected && (
            <TouchableOpacity
              style={[styles.clearBtn, { borderColor: colors.border }]}
              onPress={() => { onSelect(null); onClose(); }}
            >
              <Text style={[styles.clearText, { color: colors.mutedForeground }]}>Clear filter</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  cityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cityText: {
    fontSize: 20,
    fontWeight: "800",
  },
  chevronWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
  countRow: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 2,
  },
  countText: {
    fontSize: 13,
    fontWeight: "500",
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
    gap: 5,
    paddingHorizontal: 11,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    gap: 10,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  sheetTitle: { fontSize: 18, fontWeight: "800" },
  sheetSub: { fontSize: 13, marginTop: -4, marginBottom: 4 },
  cityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  cityCard: {
    width: "47%",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 6,
    position: "relative",
  },
  cityEmoji: { fontSize: 32 },
  cityName: { fontSize: 14 },
  cityCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  cityCount: { fontSize: 11, fontWeight: "600" },
  checkIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  sheetOptionText: { fontSize: 15 },
  clearBtn: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 4,
  },
  clearText: { fontSize: 14, fontWeight: "600" },
});
