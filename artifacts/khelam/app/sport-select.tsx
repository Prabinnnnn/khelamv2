import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

const SPORTS = [
  { name: "Futsal", emoji: "⚽" },
  { name: "Football", emoji: "🏈" },
  { name: "Volleyball", emoji: "🏐" },
  { name: "Cricket", emoji: "🏏" },
  { name: "Basketball", emoji: "🏀" },
  { name: "Badminton", emoji: "🏸" },
  { name: "Table Tennis", emoji: "🏓" },
  { name: "Tennis", emoji: "🎾" },
  { name: "E-Sports", emoji: "🎮" },
];

export default function SportSelectScreen() {
  const insets = useSafeAreaInsets();
  const { setSelectedSport } = useAuth();
  const [selected, setSelected] = useState("");

  const handleStart = () => {
    if (!selected) return;
    setSelectedSport(selected);
    router.replace("/(tabs)/discover");
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0D0D0D" }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.heading}>What do you play?</Text>
        <Text style={styles.sub}>Pick your primary sport to get started</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {SPORTS.map((sport) => {
          const isSelected = selected === sport.name;
          return (
            <TouchableOpacity
              key={sport.name}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? "#C8F24818" : "#1A1A1A",
                  borderColor: isSelected ? "#C8F248" : "#2E2E2E",
                  borderWidth: isSelected ? 2.5 : 1,
                },
              ]}
              onPress={() => setSelected(sport.name)}
              activeOpacity={0.85}
            >
              {isSelected && (
                <View style={styles.glowRing} />
              )}
              <Text style={styles.emoji}>{sport.emoji}</Text>
              <Text
                style={[
                  styles.sportName,
                  { color: isSelected ? "#C8F248" : "#FFF" },
                ]}
              >
                {sport.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: selected ? "#C8F248" : "#2E2E2E" },
          ]}
          onPress={handleStart}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, { color: selected ? "#0D0D0D" : "#9E9E9E" }]}>
            {selected ? `Find ${selected} Games` : "Select a Sport"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 20, gap: 6 },
  heading: { fontSize: 26, fontWeight: "800", color: "#FFF" },
  sub: { fontSize: 14, color: "#9E9E9E" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 24,
    justifyContent: "center",
  },
  card: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    position: "relative",
    overflow: "hidden",
  },
  glowRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: "#C8F248",
    opacity: 0.3,
  },
  emoji: { fontSize: 38 },
  sportName: { fontSize: 12, fontWeight: "700", textAlign: "center" },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
  btn: { paddingVertical: 16, borderRadius: 100, alignItems: "center" },
  btnText: { fontSize: 16, fontWeight: "800" },
});
