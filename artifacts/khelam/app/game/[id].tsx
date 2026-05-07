import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGames } from "@/context/GamesContext";
import { useColors } from "@/hooks/useColors";

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getGame, joinedGameIds, leaveGame } = useGames();
  const game = getGame(id);
  const isJoined = joinedGameIds.includes(id);
  const [expandedSection, setExpandedSection] = useState<string | null>("rules");

  if (!game) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, fontSize: 16 }}>Game not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#C8F248", marginTop: 12 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pct = game.filledSlots / game.slots;
  const canJoin = game.status === "open" && !isJoined;
  const isDisabled = game.status === "full" || game.status === "locked";

  const handleJoin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/game/join?gameId=${game.id}`);
  };

  const handleLeave = () => {
    Alert.alert(
      "Leave Game?",
      "Are you sure? Your slot will be released and refunded to your wallet.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            await leaveGame(game.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const DetailRow = ({
    icon,
    value,
    accent,
  }: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    value: string;
    accent?: boolean;
  }) => (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: colors.card }]}>
        <Ionicons name={icon} size={16} color={accent ? "#C8F248" : colors.mutedForeground} />
      </View>
      <Text style={[styles.detailValue, { color: accent ? colors.foreground : colors.foreground, fontWeight: accent ? "700" : "500" }]}>
        {value}
        {accent && (
          <Text style={{ color: "#22C55E" }}> (Electric Lime)</Text>
        )}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* Header overlay on hero */}
      <View
        style={[
          styles.navBar,
          { paddingTop: insets.top + 8, backgroundColor: "transparent" },
        ]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {game.title}
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          >
            <Ionicons name="share-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          >
            <Ionicons name="person-add-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroPlaceholder, { backgroundColor: "#1A1A1A" }]}>
            <Text style={styles.heroEmoji}>
              {game.sport === "Futsal" ? "⚽" : game.sport === "Football" ? "🏈" : game.sport === "Cricket" ? "🏏" : "🏆"}
            </Text>
            <View style={styles.heroGradient} />
          </View>
        </View>

        <View style={[styles.content, { backgroundColor: colors.background }]}>
          {/* Title + Status */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[styles.gameTitle, { color: colors.foreground }]}>
                {game.title}
              </Text>
              <View style={styles.badges}>
                <View style={[styles.sportBadge, { backgroundColor: "#C8F24820" }]}>
                  <Text style={[styles.sportBadgeText, { color: "#1A1A1A" }]}>{game.sport}</Text>
                </View>
                <View style={[styles.sportBadge, { backgroundColor: game.isIndoor ? "#DBEAFE" : "#DCFCE7" }]}>
                  <Text style={[styles.sportBadgeText, { color: game.isIndoor ? "#1D4ED8" : "#15803D" }]}>
                    {game.isIndoor ? "Indoor" : "Outdoor"}
                  </Text>
                </View>
              </View>
            </View>
            {game.status === "full" && (
              <View style={[styles.statusBadge, { backgroundColor: "#FF4D4D22", borderColor: "#FF4D4D44" }]}>
                <Text style={{ color: "#FF4D4D", fontWeight: "700", fontSize: 13 }}>Full</Text>
              </View>
            )}
            {game.status === "locked" && (
              <View style={[styles.statusBadge, { backgroundColor: "#F59E0B22", borderColor: "#F59E0B44" }]}>
                <Ionicons name="lock-closed" size={12} color="#F59E0B" />
                <Text style={{ color: "#F59E0B", fontWeight: "700", fontSize: 13 }}>Locked</Text>
              </View>
            )}
          </View>

          {/* Slots bar */}
          <View style={[styles.slotsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.slotsTop}>
              <Text style={[styles.slotsLabel, { color: colors.mutedForeground }]}>Spots Available</Text>
              <Text style={[styles.slotsCount, { color: colors.foreground }]}>
                {game.slots - game.filledSlots} left
              </Text>
            </View>
            <View style={[styles.slotBarBg, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.slotBarFill,
                  {
                    width: `${pct * 100}%` as any,
                    backgroundColor: pct >= 1 ? "#FF4D4D" : pct > 0.7 ? "#F59E0B" : "#C8F248",
                  },
                ]}
              />
            </View>
            <Text style={[styles.slotsDetail, { color: colors.mutedForeground }]}>
              {game.filledSlots} / {game.slots} players joined
            </Text>
          </View>

          {/* Details */}
          <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.background }]}>
                <Ionicons name="calendar-outline" size={16} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {game.dateLabel} · {game.time}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.background }]}>
                <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {game.venue} · {game.address}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.background }]}>
                <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>
                {game.duration} · {game.format}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: "#C8F24820" }]}>
                <Ionicons name="cash-outline" size={16} color="#1A1A1A" />
              </View>
              <Text style={[styles.detailValue, { color: colors.foreground, fontWeight: "800", fontSize: 17 }]}>
                NPR {game.price}
              </Text>
            </View>
          </View>

          {/* Joined Players */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Players ({game.filledSlots})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.playersRow}>
                {game.players.slice(0, 8).map((p, i) => (
                  <View key={p.id} style={styles.playerItem}>
                    <View style={[styles.playerAvatar, { backgroundColor: "#C8F24830" }]}>
                      <Text style={styles.playerInitial}>{p.name.charAt(0)}</Text>
                    </View>
                    <Text style={[styles.playerName, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {p.name}
                    </Text>
                  </View>
                ))}
                {game.filledSlots > 8 && (
                  <View style={styles.playerItem}>
                    <View style={[styles.playerAvatar, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
                      <Text style={[styles.playerInitial, { color: colors.mutedForeground, fontSize: 11 }]}>
                        +{game.filledSlots - 8}
                      </Text>
                    </View>
                    <Text style={[styles.playerName, { color: colors.mutedForeground }]}>more</Text>
                  </View>
                )}
                {Array.from({ length: Math.max(0, game.slots - game.filledSlots) }).slice(0, 4).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.playerItem}>
                    <View style={[styles.playerAvatar, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderStyle: "dashed" }]}>
                      <Ionicons name="person-add-outline" size={16} color={colors.border} />
                    </View>
                    <Text style={[styles.playerName, { color: colors.border }]}>Open</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Info sections */}
          {[
            { key: "rules", title: "Rules", content: game.rules },
            { key: "kit", title: "Kit to Bring", content: game.kitToBring.join(", ") },
            { key: "notes", title: "Notes", content: game.notes || "No additional notes." },
          ].map((section) => (
            <TouchableOpacity
              key={section.key}
              style={[styles.infoSection, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              activeOpacity={0.8}
            >
              <View style={styles.infoHeader}>
                <Text style={[styles.infoTitle, { color: colors.foreground }]}>{section.title}</Text>
                <Ionicons
                  name={expandedSection === section.key ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.mutedForeground}
                />
              </View>
              {expandedSection === section.key && (
                <Text style={[styles.infoContent, { color: colors.mutedForeground }]}>
                  {section.content}
                </Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Host Card */}
          <View style={[styles.hostCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.hostAvatar, { backgroundColor: "#C8F24830" }]}>
              <Text style={styles.hostInitial}>{game.hostName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.hostName, { color: colors.foreground }]}>{game.hostName}</Text>
              <Text style={[styles.hostBio, { color: colors.mutedForeground }]} numberOfLines={2}>
                {game.hostBio}
              </Text>
            </View>
            <View style={[styles.verifiedBadge, { backgroundColor: "#22C55E22" }]}>
              <Ionicons name="shield-checkmark" size={14} color="#22C55E" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          {/* Support */}
          <TouchableOpacity style={[styles.supportRow, { borderColor: colors.border }]}>
            <Ionicons name="help-circle-outline" size={18} color={colors.mutedForeground} />
            <Text style={[styles.supportText, { color: colors.mutedForeground }]}>
              Contact Khelam Support
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        {isJoined ? (
          <TouchableOpacity
            style={[styles.joinBtn, { backgroundColor: "#FF4D4D11", borderColor: "#FF4D4D44", borderWidth: 1 }]}
            onPress={handleLeave}
            activeOpacity={0.85}
          >
            <Text style={[styles.joinBtnText, { color: "#FF4D4D" }]}>Leave Game</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.joinBtn,
              {
                backgroundColor: isDisabled ? "#E5E7D0" : "#C8F248",
                opacity: isDisabled ? 0.7 : 1,
              },
            ]}
            onPress={canJoin ? handleJoin : undefined}
            disabled={isDisabled}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.joinBtnText,
                { color: isDisabled ? "#9CA3AF" : "#0D0D0D" },
              ]}
            >
              {game.status === "full"
                ? "Game is Full"
                : game.status === "locked"
                ? "Game Locked"
                : `Join Game · NPR ${game.price}`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  hero: { height: 260 },
  heroPlaceholder: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: { fontSize: 80 },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(250,251,232,0.9)",
  },
  content: { padding: 20, gap: 16 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  gameTitle: { fontSize: 22, fontWeight: "800", lineHeight: 28 },
  badges: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  sportBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  sportBadgeText: { fontSize: 12, fontWeight: "700" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
  },
  slotsCard: {
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
  },
  slotsTop: { flexDirection: "row", justifyContent: "space-between" },
  slotsLabel: { fontSize: 13 },
  slotsCount: { fontSize: 13, fontWeight: "700" },
  slotBarBg: { height: 8, borderRadius: 100, overflow: "hidden" },
  slotBarFill: { height: "100%", borderRadius: 100 },
  slotsDetail: { fontSize: 12 },
  detailsCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  detailValue: { flex: 1, fontSize: 14, fontWeight: "500" },
  divider: { height: 1, marginHorizontal: 14 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  playersRow: { flexDirection: "row", gap: 14 },
  playerItem: { alignItems: "center", gap: 4, width: 50 },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  playerInitial: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  playerName: { fontSize: 11, textAlign: "center" },
  infoSection: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoTitle: { fontSize: 15, fontWeight: "700" },
  infoContent: { fontSize: 14, lineHeight: 22 },
  hostCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  hostAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  hostInitial: { fontSize: 20, fontWeight: "800", color: "#1A1A1A" },
  hostName: { fontSize: 15, fontWeight: "700" },
  hostBio: { fontSize: 13, marginTop: 2 },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },
  verifiedText: { fontSize: 12, fontWeight: "700", color: "#22C55E" },
  supportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  supportText: { flex: 1, fontSize: 14, fontWeight: "500" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  joinBtn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  joinBtnText: { fontSize: 16, fontWeight: "800" },
});
