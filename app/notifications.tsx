import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const NOTIFICATIONS = [
  {
    id: "n1",
    type: "joined",
    title: "You joined Friday Futsal Clash",
    body: "Get ready! The game is on May 8 at 6:00 PM at Pragya Futsal Arena.",
    time: "2 min ago",
    read: false,
    icon: "checkmark-circle" as const,
    iconColor: "#22C55E",
  },
  {
    id: "n2",
    type: "reminder",
    title: "Game reminder — 24 hours to go",
    body: "Friday Futsal Clash is tomorrow at 6:00 PM. Don't forget your kit!",
    time: "1 hour ago",
    read: false,
    icon: "alarm-outline" as const,
    iconColor: "#F59E0B",
  },
  {
    id: "n3",
    type: "host",
    title: "Host verification update",
    body: "Your host application is under review. We'll notify you within 24-48 hours.",
    time: "Yesterday",
    read: true,
    icon: "shield-checkmark-outline" as const,
    iconColor: "#60A5FA",
  },
  {
    id: "n4",
    type: "payment",
    title: "Payment confirmed",
    body: "NPR 525 paid for Weekend Football League. Slot secured!",
    time: "2 days ago",
    read: true,
    icon: "card-outline" as const,
    iconColor: "#A78BFA",
  },
  {
    id: "n5",
    type: "cancelled",
    title: "Game cancelled by host",
    body: "Evening Cricket Scrimmage (Apr 30) was cancelled. NPR 200 refunded to your wallet.",
    time: "3 days ago",
    read: true,
    icon: "close-circle-outline" as const,
    iconColor: "#FF4D4D",
  },
];

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [notifications, setNotifications] = React.useState(NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead}>
          <Text style={{ color: "#1A1A1A", fontSize: 13, fontWeight: "600" }}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notifCard,
              {
                backgroundColor: item.read ? colors.background : colors.card,
                borderColor: item.read ? colors.border : "#C8F24830",
                borderLeftColor: item.read ? colors.border : "#C8F248",
                borderLeftWidth: item.read ? 1 : 3,
              },
            ]}
            onPress={() => toggleRead(item.id)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.notifIcon,
                { backgroundColor: item.iconColor + "22" },
              ]}
            >
              <Ionicons name={item.icon} size={20} color={item.iconColor} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <View style={styles.notifTop}>
                <Text
                  style={[
                    styles.notifTitle,
                    { color: colors.foreground, fontWeight: item.read ? "500" : "700" },
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {!item.read && (
                  <View style={[styles.dot, { backgroundColor: "#C8F248" }]} />
                )}
              </View>
              <Text
                style={[styles.notifBody, { color: colors.mutedForeground }]}
                numberOfLines={2}
              >
                {item.body}
              </Text>
              <Text style={[styles.notifTime, { color: colors.textTertiary || colors.mutedForeground }]}>
                {item.time}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { flex: 1, fontSize: 20, fontWeight: "800" },
  list: { paddingHorizontal: 20 },
  notifCard: {
    flexDirection: "row",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  notifTitle: { flex: 1, fontSize: 14 },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  notifBody: { fontSize: 13, lineHeight: 19 },
  notifTime: { fontSize: 11 },
});
