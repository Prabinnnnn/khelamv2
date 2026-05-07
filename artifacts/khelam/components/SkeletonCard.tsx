import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";

export function SkeletonCard() {
  const colors = useColors();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  const bone = (w: number | string, h: number, r = 6) => (
    <Animated.View
      style={[
        { width: w as any, height: h, borderRadius: r, opacity },
        { backgroundColor: colors.border },
      ]}
    />
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.bar, { backgroundColor: colors.border }]} />
      <View style={styles.inner}>
        {bone(52, 52, 10)}
        <View style={styles.content}>
          {bone("70%", 14)}
          {bone("50%", 11)}
          {bone("60%", 11)}
          {bone("100%", 4, 100)}
          {bone("40%", 11)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    flexDirection: "row",
    borderWidth: 1,
  },
  bar: {
    width: 4,
  },
  inner: {
    flex: 1,
    flexDirection: "row",
    padding: 14,
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 8,
  },
});
