import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export default function AboutKhelamScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

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
        <Text style={[styles.navTitle, { color: colors.foreground }]}>About Khelam</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo & Version */}
        <View style={styles.logoSection}>
          <View style={[styles.logoBox, { backgroundColor: "#C8F24833" }]}>
            <Ionicons name="basketball" size={48} color="#C8F248" />
          </View>
          <Text style={[styles.appName, { color: colors.foreground }]}>Khelam</Text>
          <Text style={[styles.version, { color: colors.mutedForeground }]}>
            Version 1.0.0
          </Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About Us</Text>
          <Text style={[styles.text, { color: colors.mutedForeground }]}>
            Khelam is a community-driven platform that connects sports enthusiasts,
            making it easy to discover, join, and organize sports games in your city.
            Whether you're looking for a casual match or want to host your own game,
            Khelam brings the sports community together.
          </Text>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Our Mission</Text>
          <Text style={[styles.text, { color: colors.mutedForeground }]}>
            We believe in the power of sports to bring people together. Our mission is
            to make sports more accessible and foster a vibrant, inclusive community where
            athletes of all skill levels can connect, play, and grow.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Key Features
          </Text>
          <View style={styles.featureList}>
            <FeatureItem
              icon="search-outline"
              title="Discover Games"
              desc="Find games near you by sport, date, and skill level"
            />
            <FeatureItem
              icon="pencil-outline"
              title="Host Games"
              desc="Organize your own games and manage participants"
            />
            <FeatureItem
              icon="people-outline"
              title="Build Community"
              desc="Connect with players and organize regular matches"
            />
            <FeatureItem
              icon="wallet-outline"
              title="Easy Payments"
              desc="Secure wallet system for seamless transactions"
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Support</Text>
          <Text style={[styles.text, { color: colors.mutedForeground }]}>
            Have questions or feedback? We'd love to hear from you!
          </Text>
          <TouchableOpacity
            style={[
              styles.contactBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => router.push("/contact-support")}
            activeOpacity={0.85}
          >
            <Ionicons name="mail-outline" size={16} color={colors.foreground} />
            <Text style={[styles.contactBtnText, { color: colors.foreground }]}>
              Contact Us
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            © 2026 Khelam. All rights reserved.{"\n"}
            Made with ❤️ for sports lovers everywhere.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  desc: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: "#C8F24822" }]}>
        <Ionicons name={icon} size={20} color="#C8F248" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.featureTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.featureDesc, { color: colors.mutedForeground }]}>{desc}</Text>
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
  scroll: { paddingHorizontal: 20, gap: 20 },
  logoSection: { alignItems: "center", marginTop: 16 },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  version: { fontSize: 12 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  text: { fontSize: 14, lineHeight: 20 },
  featureList: { gap: 12 },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  featureDesc: { fontSize: 12 },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    marginTop: 8,
  },
  contactBtnText: { fontSize: 14, fontWeight: "600" },
  infoBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
  },
  infoText: { fontSize: 12, lineHeight: 18, textAlign: "center" },
});
