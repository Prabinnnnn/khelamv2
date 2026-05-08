import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

const PAYMENT_METHODS = [
  { id: "esewa", name: "eSewa", emoji: "💚", color: "#60BB47" },
  { id: "khalti", name: "Khalti", emoji: "💜", color: "#5C2D91" },
  { id: "fonepay", name: "FonePay", emoji: "🔴", color: "#E31E1E" },
  { id: "wallet", name: "Khelam Wallet", emoji: "💰", color: "#C8F248" },
];

export default function JoinGameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getGame, joinGame } = useGames();
  const game = getGame(gameId);
  const [selectedPayment, setSelectedPayment] = useState("esewa");
  const [loading, setLoading] = useState(false);

  if (!game) return null;

  const platformFee = Math.round(game.price * 0.05);
  const total = game.price + platformFee;

  const handlePay = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    await joinGame(game.id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(false);
    Alert.alert(
      "You're in!",
      `You've successfully joined ${game.title}. See you on the field!`,
      [{ text: "View Game", onPress: () => router.replace(`/game/${game.id}`) }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />

      {/* Nav */}
      <View style={[styles.nav, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>Join Game</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Game Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: "#1A1A1A" }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={{ fontSize: 32 }}>
              {game.sport === "Futsal" ? "🥅" : game.sport === "Cricket" ? "🏏" : "🏆"}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryTitle}>{game.title}</Text>
              <Text style={styles.summaryMeta}>
                {game.dateLabel} · {game.time}
              </Text>
              <Text style={styles.summaryMeta}>{game.venue}</Text>
            </View>
            <View style={[styles.slotsChip, { backgroundColor: "#C8F24830" }]}>
              <Text style={{ color: "#C8F248", fontSize: 12, fontWeight: "700" }}>
                {game.slots - game.filledSlots} spots left
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
          Select Payment Method
        </Text>
        {PAYMENT_METHODS.map((method) => {
          const selected = selectedPayment === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                {
                  backgroundColor: colors.card,
                  borderColor: selected ? "#1A1A1A" : colors.border,
                  borderWidth: selected ? 2 : 1,
                },
              ]}
              onPress={() => {
                setSelectedPayment(method.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.85}
            >
              <View
                style={[styles.radioOuter, { borderColor: selected ? "#1A1A1A" : colors.border }]}
              >
                {selected && (
                  <View style={[styles.radioInner, { backgroundColor: "#1A1A1A" }]} />
                )}
              </View>
              <Text style={{ fontSize: 22 }}>{method.emoji}</Text>
              <Text style={[styles.paymentName, { color: colors.foreground }]}>
                {method.name}
              </Text>
              {method.id === "wallet" && (
                <View style={[styles.walletBadge, { backgroundColor: "#C8F24820" }]}>
                  <Text style={{ color: "#1A1A1A", fontSize: 11, fontWeight: "700" }}>
                    NPR 500 available
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Fee Breakdown */}
        <View style={[styles.feeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.feeTitle, { color: colors.foreground }]}>Fee Breakdown</Text>
          <View style={styles.feeLine}>
            <Text style={[styles.feeLabel, { color: colors.mutedForeground }]}>Entry Fee</Text>
            <Text style={[styles.feeValue, { color: colors.foreground }]}>NPR {game.price}</Text>
          </View>
          <View style={styles.feeLine}>
            <Text style={[styles.feeLabel, { color: colors.mutedForeground }]}>Platform Fee (5%)</Text>
            <Text style={[styles.feeValue, { color: colors.mutedForeground }]}>NPR {platformFee}</Text>
          </View>
          <View style={[styles.feeDivider, { backgroundColor: colors.border }]} />
          <View style={styles.feeLine}>
            <Text style={[styles.feeTotalLabel, { color: colors.foreground }]}>Total</Text>
            <Text style={[styles.feeTotalValue, { color: colors.foreground }]}>NPR {total}</Text>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={[styles.policyCard, { backgroundColor: "#FEF3C711", borderColor: "#F59E0B33" }]}>
          <Ionicons name="information-circle-outline" size={18} color="#F59E0B" />
          <Text style={{ color: "#92400E", fontSize: 13, flex: 1 }}>
            Free cancellation up to 24 hours before the game. Refunded to Khelam Wallet.
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View
        style={[
          styles.bottomBar,
          { borderTopColor: colors.border, paddingBottom: insets.bottom + 16, backgroundColor: colors.background },
        ]}
      >
        <TouchableOpacity
          style={[styles.payBtn, { backgroundColor: loading ? "#A0C43A" : "#C8F248" }]}
          onPress={handlePay}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Ionicons name="shield-checkmark-outline" size={18} color="#0D0D0D" />
          <Text style={styles.payBtnText}>
            {loading ? "Processing..." : `Confirm & Pay  NPR ${total}`}
          </Text>
        </TouchableOpacity>
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
  scroll: { paddingHorizontal: 20, gap: 16 },
  summaryCard: {
    borderRadius: 16,
    padding: 18,
  },
  summaryTitle: { fontSize: 16, fontWeight: "700", color: "#FFF" },
  summaryMeta: { fontSize: 13, color: "#9E9E9E", marginTop: 2 },
  slotsChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100 },
  sectionLabel: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  paymentName: { flex: 1, fontSize: 15, fontWeight: "600" },
  walletBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  feeCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  feeTitle: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  feeLine: { flexDirection: "row", justifyContent: "space-between" },
  feeLabel: { fontSize: 14 },
  feeValue: { fontSize: 14, fontWeight: "600" },
  feeDivider: { height: 1 },
  feeTotalLabel: { fontSize: 15, fontWeight: "700" },
  feeTotalValue: { fontSize: 18, fontWeight: "800" },
  policyCard: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 100,
  },
  payBtnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
});
