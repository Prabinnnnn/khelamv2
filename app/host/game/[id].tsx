import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

export default function HostGameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getGame } = useGames();
  const game = getGame(id);
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
  const isUpcoming = ["open", "full", "locked"].includes(game.status);

  const handleCancelGame = () => {
    Alert.alert(
      "Cancel Game?",
      "This action cannot be undone. All joined players will be notified and refunded automatically.",
      [
        { text: "No, Keep it", style: "cancel" },
        {
          text: "Yes, Cancel Game",
          style: "destructive",
          onPress: () => {
            Alert.alert("Game Cancelled", "The game has been cancelled and players notified.");
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={[
          styles.navBar,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border
          },
        ]}
      >
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.foreground }]} numberOfLines={1}>
          Manage Game
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Emoji Section */}
        <View style={styles.hero}>
          <View style={[styles.heroPlaceholder, { backgroundColor: "#1A1A1A" }]}>
            <Text style={styles.heroEmoji}>
              {game.sport === "Futsal" ? "🥅" : game.sport === "Football" ? "⚽" : game.sport === "Cricket" ? "🏏" : "🏆"}
            </Text>
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
                <View style={[styles.statusBadge, {
                  backgroundColor: game.status === "cancelled" ? "#FF4D4D22" : game.status === "completed" ? "#22C55E22" : "#C8F24822",
                  borderColor: game.status === "cancelled" ? "#FF4D4D44" : game.status === "completed" ? "#22C55E44" : "#C8F24844"
                }]}>
                  <Text style={{
                    color: game.status === "cancelled" ? "#FF4D4D" : game.status === "completed" ? "#22C55E" : "#1A1A1A",
                    fontWeight: "700",
                    fontSize: 12,
                    textTransform: "capitalize"
                  }}>
                    {game.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Slots bar */}
          <View style={[styles.slotsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.slotsTop}>
              <Text style={[styles.slotsLabel, { color: colors.mutedForeground }]}>Booking Progress</Text>
              <Text style={[styles.slotsCount, { color: colors.foreground }]}>
                {game.filledSlots} / {game.slots} joined
              </Text>
            </View>
            <View style={[styles.slotBarBg, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.slotBarFill,
                  {
                    width: `${pct * 100}%` as any,
                    backgroundColor: "#C8F248",
                  },
                ]}
              />
            </View>
          </View>

          {/* Details */}
          <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <DetailItem icon="calendar-outline" label="Date & Time" value={`${game.dateLabel} · ${game.time}`} colors={colors} />
            <DetailItem icon="location-outline" label="Venue" value={`${game.venue} · ${game.address}`} colors={colors} />
            <DetailItem icon="cash-outline" label="Price per head" value={`NPR ${game.price}`} colors={colors} />
          </View>

          {/* Player List */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Manage Players ({game.filledSlots})
            </Text>
            <View style={styles.playerList}>
              {game.players.length > 0 ? game.players.map((p) => (
                <View key={p.id} style={[styles.playerRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.playerAvatar, { backgroundColor: "#C8F24820" }]}>
                    <Text style={styles.playerInitial}>{p.name.charAt(0)}</Text>
                  </View>
                  <Text style={[styles.playerRowName, { color: colors.foreground }]}>{p.name}</Text>
                  <TouchableOpacity style={styles.contactBtn}>
                    <Ionicons name="chatbubble-outline" size={18} color="#C8F248" />
                  </TouchableOpacity>
                </View>
              )) : (
                <Text style={{ color: colors.mutedForeground, fontStyle: "italic" }}>No players joined yet.</Text>
              )}
            </View>
          </View>

          {/* Info sections */}
          {[
            { key: "rules", title: "Game Rules", content: game.rules },
            { key: "notes", title: "Organizer Notes", content: game.notes || "No additional notes." },
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
        </View>
      </ScrollView>

      {/* Bottom Action */}
      {isUpcoming && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelBtn, { borderColor: "#FF4D4D", borderWidth: 1.5 }]}
            onPress={handleCancelGame}
          >
            <Ionicons name="close-circle-outline" size={20} color="#FF4D4D" />
            <Text style={styles.cancelBtnText}>Cancel Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function DetailItem({ icon, label, value, colors }: { icon: any, label: string, value: string, colors: any }) {
  return (
    <View style={styles.detailItem}>
      <View style={[styles.detailIcon, { backgroundColor: colors.background }]}>
        <Ionicons name={icon} size={18} color={colors.mutedForeground} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  hero: { height: 180 },
  heroPlaceholder: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: { fontSize: 64 },
  content: { padding: 20, gap: 20 },
  titleRow: { gap: 8 },
  gameTitle: { fontSize: 24, fontWeight: "800" },
  badges: { flexDirection: "row", gap: 8 },
  sportBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100 },
  sportBadgeText: { fontSize: 12, fontWeight: "700" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
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
  slotsLabel: { fontSize: 13, fontWeight: "600" },
  slotsCount: { fontSize: 13, fontWeight: "700" },
  slotBarBg: { height: 8, borderRadius: 100, overflow: "hidden" },
  slotBarFill: { height: "100%", borderRadius: 100 },
  detailsCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  detailItem: { flexDirection: "row", gap: 14, alignItems: "center" },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: { fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 },
  detailValue: { fontSize: 14, fontWeight: "600", marginTop: 1 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  playerList: { gap: 0 },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  playerInitial: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  playerRowName: { flex: 1, fontSize: 15, fontWeight: "500" },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoTitle: { fontSize: 15, fontWeight: "700" },
  infoContent: { fontSize: 14, lineHeight: 22 },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    backgroundColor: "transparent",
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 100,
  },
  cancelBtnText: { color: "#FF4D4D", fontSize: 16, fontWeight: "800" },
});
