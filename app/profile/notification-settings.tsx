import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export default function NotificationSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "game_updates",
      label: "Game Updates",
      description: "Get notified about game changes and cancellations",
      enabled: true,
    },
    {
      id: "host_requests",
      label: "Host Requests",
      description: "Receive notifications when players join your games",
      enabled: true,
    },
    {
      id: "messages",
      label: "Messages",
      description: "Chat messages from other players",
      enabled: true,
    },
    {
      id: "promotions",
      label: "Promotions & Offers",
      description: "Special deals and limited-time offers",
      enabled: false,
    },
    {
      id: "reminders",
      label: "Game Reminders",
      description: "Reminders before your scheduled games",
      enabled: true,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
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
        <Text style={[styles.navTitle, { color: colors.foreground }]}>
          Notification Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          Manage how you receive notifications from Khelam.
        </Text>

        <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {settings.map((setting, index) => (
            <View
              key={setting.id}
              style={[
                styles.settingRow,
                index < settings.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>
                  {setting.label}
                </Text>
                <Text style={[styles.settingDesc, { color: colors.mutedForeground }]}>
                  {setting.description}
                </Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleSetting(setting.id)}
                trackColor={{ false: colors.border, true: "#C8F24844" }}
                thumbColor={setting.enabled ? "#C8F248" : colors.border}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          Note: Critical notifications (like security alerts) cannot be disabled.
        </Text>
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
  description: { fontSize: 14, lineHeight: 20, marginTop: 8 },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  settingLabel: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  settingDesc: { fontSize: 13 },
  footer: { fontSize: 12, lineHeight: 18, marginTop: 16, textAlign: "center" },
});
