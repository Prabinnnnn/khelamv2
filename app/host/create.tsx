import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { Game, useGames } from "@/context/GamesContext";
import { useColors } from "@/hooks/useColors";

const SPORTS = ["Futsal", "Football", "Cricket", "Basketball", "Badminton", "Volleyball", "E-Sports"];

export default function CreateGameScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addHostedGame } = useGames();

  const [sport, setSport] = useState("Futsal");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60 min");
  const [format, setFormat] = useState("5 vs 5");
  const [slots, setSlots] = useState("10");
  const [price, setPrice] = useState("");
  const [rules, setRules] = useState("");
  const [notes, setNotes] = useState("");
  const [isIndoor, setIsIndoor] = useState(true);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!venue || !date || !time || !price) {
      Alert.alert("Required", "Please fill in venue, date, time, and price.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newGame: Game = {
      id: `hg_${Date.now()}`,
      title: `${sport} at ${venue}`,
      sport,
      venue,
      address,
      date,
      dateLabel: date,
      time,
      duration,
      format,
      slots: parseInt(slots) || 10,
      filledSlots: 0,
      price: parseInt(price) || 0,
      isIndoor,
      hostId: user?.id ?? "user_1",
      hostName: user?.name ?? "Host",
      hostAvatar: "",
      hostBio: "",
      image: "",
      status: "open",
      rules,
      notes,
      kitToBring: [],
      players: [],
      city: user?.city ?? "Kathmandu",
    };

    addHostedGame(newGame);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(false);
    Alert.alert(
      "Game Published!",
      "Your game is now live on Khelam.",
      [{ text: "View Dashboard", onPress: () => router.replace("/host") }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.nav, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: colors.card }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: colors.foreground }]}>Host a Game</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Sport Selector */}
          <SectionTitle title="Sport" colors={colors} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportScroll}>
            {SPORTS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.sportChip,
                  {
                    backgroundColor: sport === s ? "#1A1A1A" : colors.card,
                    borderColor: sport === s ? "#1A1A1A" : colors.border,
                  },
                ]}
                onPress={() => setSport(s)}
              >
                <Text style={[styles.sportChipText, { color: sport === s ? "#C8F248" : colors.mutedForeground }]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Venue */}
          <SectionTitle title="Venue" colors={colors} />
          <FormField
            icon="business-outline"
            placeholder="Venue name"
            value={venue}
            onChangeText={setVenue}
            colors={colors}
          />
          <FormField
            icon="location-outline"
            placeholder="Full address"
            value={address}
            onChangeText={setAddress}
            colors={colors}
          />

          {/* Indoor / Outdoor */}
          <View style={styles.toggleRow}>
            {[true, false].map((val) => (
              <TouchableOpacity
                key={String(val)}
                style={[
                  styles.toggleBtn,
                  {
                    backgroundColor: isIndoor === val ? "#1A1A1A" : colors.card,
                    borderColor: isIndoor === val ? "#1A1A1A" : colors.border,
                    flex: 1,
                  },
                ]}
                onPress={() => setIsIndoor(val)}
              >
                <Ionicons
                  name={val ? "home-outline" : "sunny-outline"}
                  size={16}
                  color={isIndoor === val ? "#C8F248" : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.toggleText,
                    { color: isIndoor === val ? "#C8F248" : colors.mutedForeground },
                  ]}
                >
                  {val ? "Indoor" : "Outdoor"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date & Time */}
          <SectionTitle title="Date & Time" colors={colors} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField
                icon="calendar-outline"
                placeholder="Date (e.g. May 15)"
                value={date}
                onChangeText={setDate}
                colors={colors}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                icon="time-outline"
                placeholder="Time (e.g. 6:00 PM)"
                value={time}
                onChangeText={setTime}
                colors={colors}
              />
            </View>
          </View>

          {/* Duration & Format */}
          <SectionTitle title="Format" colors={colors} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField
                icon="hourglass-outline"
                placeholder="Duration"
                value={duration}
                onChangeText={setDuration}
                colors={colors}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                icon="people-outline"
                placeholder="Format (5 vs 5)"
                value={format}
                onChangeText={setFormat}
                colors={colors}
              />
            </View>
          </View>

          {/* Slots & Price */}
          <SectionTitle title="Slots & Pricing" colors={colors} />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <FormField
                icon="person-add-outline"
                placeholder="Total slots"
                value={slots}
                onChangeText={setSlots}
                keyboardType="number-pad"
                colors={colors}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                icon="cash-outline"
                placeholder="Price (NPR)"
                value={price}
                onChangeText={setPrice}
                keyboardType="number-pad"
                colors={colors}
              />
            </View>
          </View>

          {/* Rules & Notes */}
          <SectionTitle title="Rules & Notes" colors={colors} />
          <View style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textAreaInput, { color: colors.foreground }]}
              placeholder="Game rules..."
              placeholderTextColor={colors.mutedForeground}
              value={rules}
              onChangeText={setRules}
              multiline
              numberOfLines={3}
            />
          </View>
          <View style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.textAreaInput, { color: colors.foreground }]}
              placeholder="Additional notes (optional)..."
              placeholderTextColor={colors.mutedForeground}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Image Upload */}
          <SectionTitle title="Cover Image" colors={colors} />
          <TouchableOpacity
            style={[styles.imageUpload, { backgroundColor: colors.card, borderColor: "#C8F24860" }]}
          >
            <Ionicons name="image-outline" size={32} color="#C8F248" />
            <Text style={[styles.uploadText, { color: colors.foreground }]}>Upload Cover Photo</Text>
            <Text style={[styles.uploadSub, { color: colors.mutedForeground }]}>Optional · Recommended 16:9</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.publishBtn, { backgroundColor: loading ? "#A0C43A" : "#C8F248" }]}
            onPress={handlePublish}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Ionicons name="rocket-outline" size={20} color="#0D0D0D" />
            <Text style={styles.publishText}>{loading ? "Publishing..." : "Publish Game"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function SectionTitle({ title, colors }: { title: string; colors: ReturnType<typeof useColors> }) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
  );
}

function FormField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  colors,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: TextInput["props"]["keyboardType"];
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name={icon} size={16} color={colors.mutedForeground} />
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
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
  scroll: { paddingHorizontal: 20, gap: 10 },
  sportScroll: { marginBottom: 4 },
  sportChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    marginRight: 8,
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
  publishBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 100,
    marginTop: 8,
  },
  publishText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
});
