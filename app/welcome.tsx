import { router } from "expo-router";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: "#0D0D0D" }]}>
      <StatusBar barStyle="light-content" />

      {/* Background gradient pattern */}
      <View style={styles.bgPattern}>
        <View style={[styles.circle1, { backgroundColor: "#C8F248" + "18" }]} />
        <View style={[styles.circle2, { backgroundColor: "#C8F248" + "10" }]} />
        <View style={[styles.circle3, { backgroundColor: "#C8F248" + "08" }]} />
      </View>

      {/* Sport thumbnails grid (decorative) */}
      <View style={styles.thumbnailGrid}>
        {["🥅", "⚽", "🏀", "🏏", "🏸", "🎮", "🏐"].map((emoji, i) => (
          <View
            key={i}
            style={[
              styles.thumbCard,
              {
                backgroundColor: "#1A1A1A",
                transform: [{ rotate: i % 2 === 0 ? "-6deg" : "4deg" }],
                opacity: 0.6 + (i % 3) * 0.1,
              },
            ]}
          >
            <Text style={styles.thumbEmoji}>{emoji}</Text>
          </View>
        ))}
      </View>

      {/* Overlay gradient */}
      <View style={styles.overlay} />

      {/* Content */}
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 },
        ]}
      >
        {/* Logo area */}
        <View style={styles.logoArea}>
          <View style={[styles.logoMark, { backgroundColor: "#C8F248" }]}>
            <Text style={styles.logoK}>K</Text>
          </View>
          <Text style={styles.logoText}>
            khela<Text style={{ color: "#C8F248" }}>m</Text>
          </Text>
          <Text style={styles.tagline}>Find your game. Join the squad.</Text>
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: "#C8F248" }]}
            onPress={() => router.push("/signup")}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnPrimaryText, { color: "#0D0D0D" }]}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnOutline, { borderColor: "#C8F248" + "60" }]}
            onPress={() => router.push("/login")}
            activeOpacity={0.85}
          >
            <Text style={[styles.btnOutlineText, { color: "#FFFFFF" }]}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  circle1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    top: -100,
    right: -100,
  },
  circle2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: 100,
    left: -80,
  },
  circle3: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: 200,
    left: 50,
  },
  thumbnailGrid: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 12,
    justifyContent: "center",
    opacity: 0.5,
  },
  thumbCard: {
    width: 90,
    height: 90,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbEmoji: {
    fontSize: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13,13,13,0.55)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  logoArea: {
    alignItems: "center",
    gap: 8,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoK: {
    fontSize: 36,
    fontWeight: "900",
    color: "#0D0D0D",
  },
  logoText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    color: "#9E9E9E",
    textAlign: "center",
  },
  buttons: { gap: 12 },
  btnPrimary: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  btnOutline: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: "center",
    borderWidth: 1.5,
  },
  btnOutlineText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
