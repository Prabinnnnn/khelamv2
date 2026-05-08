import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Game } from "@/context/GamesContext";
import { useColors } from "@/hooks/useColors";

interface GameCardProps {
  game: Game;
  isJoined?: boolean;
  onPress?: () => void;
  isPast?: boolean;
}

function SlotsBar({
  filled,
  total,
  colors,
}: {
  filled: number;
  total: number;
  colors: ReturnType<typeof useColors>;
}) {
  const pct = Math.min(filled / total, 1);
  const barColor =
    pct >= 1 ? colors.destructive : pct > 0.7 ? colors.warning : colors.primary;

  return (
    <View style={styles.slotsRow}>
      <View style={[styles.slotsBar, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.slotsBarFill,
            { width: `${pct * 100}%` as any, backgroundColor: barColor },
          ]}
        />
      </View>
      <Text style={[styles.slotsText, { color: colors.mutedForeground }]}>
        {filled}/{total}
      </Text>
    </View>
  );
}

export function GameCard({ game, isJoined, onPress, isPast }: GameCardProps) {
  const colors = useColors();

  const sportColors: Record<string, string> = {
    Futsal: "#C8F248",
    Football: "#4ADE80",
    Cricket: "#60A5FA",
    Basketball: "#FB923C",
    Badminton: "#A78BFA",
    "Table Tennis": "#F472B6",
    Tennis: "#FBBF24",
    Volleyball: "#34D399",
    "E-Sports": "#F87171",
  };
  const sportColor = sportColors[game.sport] || colors.primary;

  const sportIcons: Record<string, string> = {
    Futsal: "🥅",
    Football: "⚽",
    Cricket: "🏏",
    Basketball: "🏀",
    Badminton: "🏸",
    "Table Tennis": "🏓",
    Tennis: "🎾",
    Volleyball: "🏐",
    "E-Sports": "🎮",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isJoined ? colors.primary : colors.border,
          borderWidth: isJoined ? 1.5 : 1,
          opacity: isPast ? 0.65 : 1,
        },
      ]}
    >
      {/* Sport color bar */}
      <View style={[styles.sportBar, { backgroundColor: sportColor }]} />

      <View style={styles.cardInner}>
        {/* Sport icon block */}
        <View
          style={[
            styles.sportIcon,
            { backgroundColor: sportColor + "22" },
          ]}
        >
          <Text style={styles.sportEmoji}>{sportIcons[game.sport] || "🏆"}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text
              style={[styles.title, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {game.title}
            </Text>
            <View style={styles.badges}>
              {game.status === "full" && (
                <View style={[styles.badge, { backgroundColor: colors.destructive }]}>
                  <Text style={styles.badgeText}>Full</Text>
                </View>
              )}
              {game.status === "locked" && (
                <View
                  style={[styles.badge, { backgroundColor: colors.warning }]}
                >
                  <Text style={styles.badgeText}>Locked</Text>
                </View>
              )}
              {isJoined && (
                <View
                  style={[styles.badge, { backgroundColor: colors.primary }]}
                >
                  <Ionicons name="checkmark" size={10} color="#0D0D0D" />
                  <Text style={[styles.badgeText, { color: "#0D0D0D" }]}>
                    {" "}Joined
                  </Text>
                </View>
              )}
              {isPast && (
                <View
                  style={[styles.badge, { backgroundColor: colors.muted }]}
                >
                  <Text style={[styles.badgeText, { color: colors.mutedForeground }]}>
                    Done
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name="time-outline"
              size={12}
              color={colors.mutedForeground}
            />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {game.time} · {game.dateLabel}
            </Text>
            <View
              style={[
                styles.indoorBadge,
                {
                  backgroundColor: game.isIndoor
                    ? "#DBEAFE"
                    : "#DCFCE7",
                },
              ]}
            >
              <Text
                style={[
                  styles.indoorText,
                  { color: game.isIndoor ? "#1D4ED8" : "#15803D" },
                ]}
              >
                {game.isIndoor ? "Indoor" : "Outdoor"}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name="location-outline"
              size={12}
              color={colors.mutedForeground}
            />
            <Text
              style={[styles.meta, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {game.address}
            </Text>
          </View>

          <SlotsBar
            filled={game.filledSlots}
            total={game.slots}
            colors={colors}
          />

          <View style={styles.bottomRow}>
            <View style={styles.hostRow}>
              <View
                style={[
                  styles.hostAvatar,
                  { backgroundColor: colors.primary + "33" },
                ]}
              >
                <Feather name="user" size={10} color={colors.primaryForeground} />
              </View>
              <Text style={[styles.hostName, { color: colors.mutedForeground }]}>
                {game.hostName}
              </Text>
            </View>
            <Text style={[styles.price, { color: colors.primary === "#C8F248" ? "#6B7280" : colors.primary }]}>
              <Text style={{ color: colors.foreground, fontWeight: "700" }}>
                NPR {game.price}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    flexDirection: "row",
  },
  sportBar: {
    width: 4,
  },
  cardInner: {
    flex: 1,
    flexDirection: "row",
    padding: 14,
    gap: 12,
  },
  sportIcon: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sportEmoji: {
    fontSize: 26,
  },
  content: {
    flex: 1,
    gap: 5,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  badges: {
    flexDirection: "row",
    gap: 4,
    flexShrink: 0,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFF",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meta: {
    fontSize: 12,
    flex: 1,
  },
  indoorBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 100,
  },
  indoorText: {
    fontSize: 10,
    fontWeight: "600",
  },
  slotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  slotsBar: {
    flex: 1,
    height: 4,
    borderRadius: 100,
    overflow: "hidden",
  },
  slotsBarFill: {
    height: "100%",
    borderRadius: 100,
  },
  slotsText: {
    fontSize: 11,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  hostAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  hostName: {
    fontSize: 11,
  },
  price: {
    fontSize: 13,
  },
});
