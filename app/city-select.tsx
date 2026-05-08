import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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

export default function CitySelectScreen() {
  const insets = useSafeAreaInsets();
  const { setSelectedCity } = useAuth();
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");

  const filtered = CITIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (!selected) return;
    setSelectedCity(selected);
    router.replace("/sport-select");
  };

  return (
    <View style={[styles.container, { backgroundColor: "#0D0D0D" }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.heading}>Where are you playing?</Text>
        <Text style={styles.sub}>Select your city to discover nearby games</Text>

        <View style={[styles.searchBar, { backgroundColor: "#1A1A1A", borderColor: "#2E2E2E" }]}>
          <Ionicons name="search-outline" size={18} color="#9E9E9E" />
          <TextInput
            style={[styles.searchInput, { color: "#FFF" }]}
            placeholder="Search city..."
            placeholderTextColor="#9E9E9E"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((city) => {
          const isSelected = selected === city.name;
          return (
            <TouchableOpacity
              key={city.name}
              style={[
                styles.cityCard,
                {
                  backgroundColor: isSelected ? "#C8F24822" : "#1A1A1A",
                  borderColor: isSelected ? "#C8F248" : "#2E2E2E",
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => setSelected(city.name)}
              activeOpacity={0.85}
            >
              <Text style={styles.cityEmoji}>{city.emoji}</Text>
              <Text style={[styles.cityName, { color: isSelected ? "#C8F248" : "#FFF" }]}>
                {city.name}
              </Text>
              {isSelected && (
                <View style={[styles.checkMark, { backgroundColor: "#C8F248" }]}>
                  <Ionicons name="checkmark" size={12} color="#0D0D0D" />
                </View>
              )}
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
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, { color: selected ? "#0D0D0D" : "#9E9E9E" }]}>
            {selected ? `Continue with ${selected}` : "Select a City"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 16, gap: 8 },
  heading: { fontSize: 26, fontWeight: "800", color: "#FFF" },
  sub: { fontSize: 14, color: "#9E9E9E", marginBottom: 8 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 24,
  },
  cityCard: {
    width: "47%",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    gap: 8,
    position: "relative",
  },
  cityEmoji: { fontSize: 36 },
  cityName: { fontSize: 15, fontWeight: "700" },
  checkMark: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
  btn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  btnText: { fontSize: 16, fontWeight: "800" },
});
