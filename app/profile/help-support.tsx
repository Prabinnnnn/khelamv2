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

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I host a game?",
    answer:
      "Go to the Host tab and click 'Create a Game'. Fill in the game details like location, date, time, and format. Review your game details and publish it.",
  },
  {
    question: "How do I join a game?",
    answer:
      "Browse games in the Discover tab, select a game you're interested in, and click 'Join Game'. You'll receive confirmation once the host approves.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept payment via mobile wallets (Khalti, eSewa, IME Pay) and bank transfers. You can add money to your Khelam wallet from your profile.",
  },
  {
    question: "How do I cancel a game?",
    answer:
      "If you're hosting, go to your Host Dashboard and select the game. You can cancel up to 24 hours before the game starts.",
  },
  {
    question: "Is there a cancellation fee?",
    answer:
      "Cancellations made more than 24 hours before the game start time have no fee. Late cancellations may incur a small fee.",
  },
];

export default function HelpSupportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

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
        <Text style={[styles.navTitle, { color: colors.foreground }]}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Frequently Asked Questions
        </Text>

        <View style={styles.faqContainer}>
          {FAQ_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.faqItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() =>
                setExpandedFaq(expandedFaq === index ? null : index)
              }
              activeOpacity={0.8}
            >
              <View style={styles.questionRow}>
                <Text style={[styles.question, { color: colors.foreground }]}>
                  {item.question}
                </Text>
                <Ionicons
                  name={
                    expandedFaq === index
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                  }
                  size={18}
                  color={colors.mutedForeground}
                />
              </View>
              {expandedFaq === index && (
                <Text style={[styles.answer, { color: colors.mutedForeground }]}>
                  {item.answer}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Need More Help?
        </Text>

        <TouchableOpacity
          style={[
            styles.contactCard,
            { backgroundColor: "#C8F24812", borderColor: "#C8F24860" },
          ]}
          onPress={() => router.push("/contact-support")}
          activeOpacity={0.85}
        >
          <View style={[styles.contactIcon, { backgroundColor: "#C8F24833" }]}>
            <Ionicons name="mail-outline" size={24} color="#1A1A1A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.contactTitle, { color: colors.foreground }]}>
              Contact Khelam Support
            </Text>
            <Text style={[styles.contactSub, { color: colors.mutedForeground }]}>
              Reach out to our support team
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
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
  scroll: { paddingHorizontal: 20, gap: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "800", marginTop: 8 },
  faqContainer: { gap: 12 },
  faqItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  question: { fontSize: 15, fontWeight: "600", flex: 1 },
  answer: { fontSize: 14, lineHeight: 20, marginTop: 12 },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  contactTitle: { fontSize: 15, fontWeight: "700" },
  contactSub: { fontSize: 13 },
});
