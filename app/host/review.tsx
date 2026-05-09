import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
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

import { useAuth } from "@/context/AuthContext";
import { Game, useGames } from "@/context/GamesContext";
import { useColors } from "@/hooks/useColors";

function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

function formatTimeForDisplay(timeStr: string): string {
  if (!timeStr) return "";
  return timeStr;
}

export default function ReviewGameScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { draftGame, addHostedGame, setDraftGame } = useGames();

  if (!draftGame) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>No game to review</Text>
      </View>
    );
  }

  const handlePublish = async () => {
    addHostedGame(draftGame);
    setDraftGame(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "Game Published!",
      "Your game is now live on Khelam.",
      [{ text: "View Dashboard", onPress: () => router.replace("/host") }]
    );
  };

  const handleEdit = () => {
    router.replace("/host/create");
  };

  const handleCancel = () => {
    setDraftGame(null);
    router.replace("/host/create");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.nav, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>Review Game</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sport Selector */}
        <SectionTitle title="Sport" colors={colors} />
        <View style={styles.sportChip}>
          <Text style={[styles.sportChipText, { color: "#C8F248" }]}>{draftGame.sport}</Text>
        </View>

        {/* Venue */}
        <SectionTitle title="Venue" colors={colors} />
        <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="business-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.input, { color: colors.foreground }]}>{draftGame.venue}</Text>
        </View>
        <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="location-outline" size={16} color={colors.mutedForeground} />
          <Text style={[styles.input, { color: colors.foreground }]}>{draftGame.address}</Text>
        </View>

        {/* Indoor / Outdoor */}
        <View style={styles.toggleRow}>
          <View
            style={[
              styles.toggleBtn,
              {
                backgroundColor: draftGame.isIndoor ? "#1A1A1A" : colors.card,
                borderColor: draftGame.isIndoor ? "#1A1A1A" : colors.border,
                flex: 1,
              },
            ]}
          >
            <Ionicons
              name="home-outline"
              size={16}
              color={draftGame.isIndoor ? "#C8F248" : colors.mutedForeground}
            />
            <Text
              style={[
                styles.toggleText,
                { color: draftGame.isIndoor ? "#C8F248" : colors.mutedForeground },
              ]}
            >
              Indoor
            </Text>
          </View>
          <View
            style={[
              styles.toggleBtn,
              {
                backgroundColor: !draftGame.isIndoor ? "#1A1A1A" : colors.card,
                borderColor: !draftGame.isIndoor ? "#1A1A1A" : colors.border,
                flex: 1,
              },
            ]}
          >
            <Ionicons
              name="sunny-outline"
              size={16}
              color={!draftGame.isIndoor ? "#C8F248" : colors.mutedForeground}
            />
            <Text
              style={[
                styles.toggleText,
                { color: !draftGame.isIndoor ? "#C8F248" : colors.mutedForeground },
              ]}
            >
              Outdoor
            </Text>
          </View>
        </View>

        {/* Date & Time */}
        <SectionTitle title="Date & Time" colors={colors} />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="calendar-outline" size={16} color={colors.mutedForeground} />
              <Text style={[styles.input, { color: colors.foreground }]}>
                {formatDateForDisplay(draftGame.date)}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={16} color={colors.mutedForeground} />
              <Text style={[styles.input, { color: colors.foreground }]}>
                {formatTimeForDisplay(draftGame.time)}
              </Text>
            </View>
          </View>
        </View>

        {/* Duration & Format */}
        <SectionTitle title="Duration & Format" colors={colors} />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <View style={styles.durationRow}>
              <View style={{ flex: 1 }}>
                <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="hourglass-outline" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.input, { color: colors.foreground }]}>{draftGame.duration.split(' ')[0]}</Text>
                </View>
              </View>
              <Text style={[styles.minLabel, { color: colors.mutedForeground }]}>min</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.formatSplitRow}>
              <View style={{ flex: 1 }}>
                <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="people-outline" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.input, { color: colors.foreground }]}>{draftGame.format.split(' vs ')[0]}</Text>
                </View>
              </View>
              <Text style={[styles.vsLabel, { color: colors.mutedForeground }]}>vs</Text>
              <View style={{ flex: 1 }}>
                <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Ionicons name="people-outline" size={16} color={colors.mutedForeground} />
                  <Text style={[styles.input, { color: colors.foreground }]}>{draftGame.format.split(' vs ')[1]}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Slots & Price */}
        <SectionTitle title="Slots & Pricing" colors={colors} />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="person-add-outline" size={16} color={colors.mutedForeground} />
              <Text style={[styles.input, { color: colors.foreground }]}>{draftGame.slots} slots</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="cash-outline" size={16} color={colors.mutedForeground} />
              <Text style={[styles.input, { color: colors.foreground }]}>NPR {draftGame.price}</Text>
            </View>
          </View>
        </View>

        {/* Rules & Notes */}
        <SectionTitle title="Rules & Notes" colors={colors} />
        <View style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.textAreaInput, { color: colors.foreground }]}>
            {draftGame.rules || "No rules specified"}
          </Text>
        </View>
        <View style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.textAreaInput, { color: colors.foreground }]}>
            {draftGame.notes || "No additional notes"}
          </Text>
        </View>

        {/* Cover Image placeholder */}
        <SectionTitle title="Cover Image" colors={colors} />
        <View style={[styles.imageUpload, { backgroundColor: colors.card, borderColor: "#C8F24860" }]}>
          <Ionicons name="image-outline" size={32} color="#C8F248" />
          <Text style={[styles.uploadText, { color: colors.foreground }]}>Cover Photo</Text>
          <Text style={[styles.uploadSub, { color: colors.mutedForeground }]}>Will be uploaded on publish</Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionText, { color: colors.mutedForeground }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleEdit}
          activeOpacity={0.8}
        >
          <Text style={[styles.actionText, { color: colors.foreground }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.publishBtn]}
          onPress={handlePublish}
          activeOpacity={0.85}
        >
          <Ionicons name="rocket-outline" size={20} color="#0D0D0D" />
          <Text style={styles.publishText}>Publish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SectionTitle({ title, colors }: { title: string; colors: ReturnType<typeof useColors> }) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
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
  scroll: { paddingHorizontal: 20, gap: 10 },
  sportChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "#1A1A1A",
    alignSelf: "flex-start",
  },
  sportChipText: { fontSize: 13, fontWeight: "600" },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginTop: 10, marginBottom: 2 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  input: { flex: 1, fontSize: 14 },
  row: { flexDirection: "row", gap: 10 },
  toggleRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  toggleText: { fontSize: 14, fontWeight: "600" },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  textAreaInput: { fontSize: 14, minHeight: 60, textAlignVertical: "top" },
  imageUpload: {
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  uploadText: { fontSize: 15, fontWeight: "600" },
  uploadSub: { fontSize: 12 },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  minLabel: {
    fontSize: 14,
    fontWeight: "700",
    paddingBottom: 8,
  },
  formatSplitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  vsLabel: {
    fontSize: 14,
    fontWeight: "700",
    paddingBottom: 8,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  actionText: { fontSize: 16, fontWeight: "600" },
  publishBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#C8F248",
  },
  publishText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
});