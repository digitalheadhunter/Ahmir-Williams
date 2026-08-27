import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/spacing";

export const RatingBadge = ({ rating }: { rating: number }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="star" size={12} color={colors.star} />
      <Text style={styles.text}>{rating.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    ...typography.small,
    color: colors.textPrimary,
  },
});
