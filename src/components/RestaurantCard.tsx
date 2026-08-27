import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RatingBadge } from "./RatingBadge";
import { Restaurant } from "@/types";
import { colors } from "@/theme/colors";
import { radius, spacing, typography } from "@/theme/spacing";

type Props = {
  restaurant: Restaurant;
  onPress: () => void;
};

export const RestaurantCard = ({ restaurant, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        {restaurant.isPromoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>Promoted</Text>
          </View>
        )}
        {restaurant.deliveryFee === 0 && (
          <View style={styles.freeDeliveryBadge}>
            <Text style={styles.freeDeliveryText}>Free delivery</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <RatingBadge rating={restaurant.rating} />
        </View>
        <Text style={styles.cuisines} numberOfLines={1}>
          {restaurant.cuisines.join(" · ")}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{restaurant.deliveryTimeMinutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="bicycle-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {restaurant.deliveryFee === 0
                ? "Free"
                : `$${restaurant.deliveryFee.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{restaurant.distanceKm.toFixed(1)} km</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: colors.surface,
  },
  promotedBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  promotedText: {
    color: colors.white,
    ...typography.small,
  },
  freeDeliveryBadge: {
    position: "absolute",
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  freeDeliveryText: {
    color: colors.white,
    ...typography.small,
  },
  content: {
    padding: spacing.md,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  cuisines: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
