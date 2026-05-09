import { Ionicons } from "@expo/vector-icons";
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

import { useColors } from "@/hooks/useColors";

type Tab = "terms" | "privacy";

export default function TermsPrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("terms");

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
        <Text style={[styles.navTitle, { color: colors.foreground }]}>
          Terms & Privacy
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "terms" && styles.activeTab,
            activeTab === "terms" && { borderBottomColor: "#C8F248" },
          ]}
          onPress={() => setActiveTab("terms")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "terms" ? colors.foreground : colors.mutedForeground,
                fontWeight: activeTab === "terms" ? "700" : "500",
              },
            ]}
          >
            Terms of Service
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "privacy" && styles.activeTab,
            activeTab === "privacy" && { borderBottomColor: "#C8F248" },
          ]}
          onPress={() => setActiveTab("privacy")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "privacy" ? colors.foreground : colors.mutedForeground,
                fontWeight: activeTab === "privacy" ? "700" : "500",
              },
            ]}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "terms" ? (
          <View style={styles.content}>
            <Text style={[styles.heading, { color: colors.foreground }]}>
              Terms of Service
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              Last Updated: May 2026
            </Text>
            <Text style={[styles.paragraph, { color: colors.foreground }]}>
              1. Acceptance of Terms
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              By using Khelam, you agree to comply with these Terms of Service and all
              applicable laws and regulations. If you do not agree with any part of these
              terms, you may not use our platform.
            </Text>
            <Text style={[styles.paragraph, { color: colors.foreground }]}>
              2. User Responsibilities
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              Users are responsible for maintaining the confidentiality of their account
              credentials and for all activities that occur under their account. You
              agree to provide accurate and complete information.
            </Text>
            <Text style={[styles.paragraph, { color: colors.foreground }]}>
              3. Game Conduct
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              All participants must conduct themselves respectfully. Khelam prohibits
              any form of harassment, discrimination, or violent conduct. Violations may
              result in account suspension.
            </Text>
            <Text style={[styles.paragraph, { color: colors.foreground }]}>
              4. Liability Limitation
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              Khelam is provided on an "as-is" basis. We are not responsible for injuries
              or damages that occur during games organized through our platform.
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={[styles.heading, { color: colors.foreground }]}>
              Privacy Policy
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              Last Updated: May 2026
            </Text>
            <Text style={[styles.paragraph, { color: colors.foreground }]}>
              1. Information We Collect
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              We collect information you provide directly, including name, email, phone
              number, and profile information. We also collect information about your
              usage of the app to improve our services.
            </Text>
            <Text style={[styles.paragraph, { color: colors.foreground }]}>
              2. How We Use Your Information
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              Your information is used to provide and improve our services, communicate
              with you, process transactions, and comply with legal obligations.
            </Text>
            <Text style={[styles.paragraph, { color: colors.foreground }]}>
              3. Data Security
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              We implement industry-standard security measures to protect your data.
              However, no online service is completely secure.
            </Text>
            <Text style={[styles.paragraph, { color: colors.foreground }]}>
              4. Third-Party Sharing
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              We do not sell your personal information. We may share data with service
              providers who help us operate the platform, all bound by confidentiality.
            </Text>
            <Text style={[styles.paragraph, { color: colors.foreground }]}>
              5. Your Rights
            </Text>
            <Text style={[styles.text, { color: colors.mutedForeground }]}>
              You have the right to access, update, or delete your personal information
              at any time through your account settings.
            </Text>
          </View>
        )}
      </ScrollView>
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
  tabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {},
  tabText: { fontSize: 14 },
  scroll: { paddingHorizontal: 20, gap: 16 },
  content: { gap: 12 },
  heading: { fontSize: 18, fontWeight: "800", marginTop: 8 },
  text: { fontSize: 13, lineHeight: 18 },
  paragraph: { fontSize: 14, fontWeight: "700", marginTop: 8 },
});
