import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MenuItem } from "@/types";
import { colors } from "@/theme/colors";
import { radius, spacing, typography } from "@/theme/spacing";

type Props = {
  item: MenuItem;
  quantityInCart: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const MenuItemRow = ({
  item,
  quantityInCart,
  onAdd,
  onIncrement,
  onDecrement,
}: Props) => {
  return (
    <View style={styles.row}>
      <View style={styles.details}>
        <View style={styles.titleRow}>
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {quantityInCart === 0 ? (
          <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={onAdd}>
            <Ionicons name="add" size={18} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.stepper}>
            <TouchableOpacity onPress={onDecrement} style={styles.stepperButton}>
              <Ionicons name="remove" size={16} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>{quantityInCart}</Text>
            <TouchableOpacity onPress={onIncrement} style={styles.stepperButton}>
              <Ionicons name="add" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  details: {
    flex: 1,
    paddingRight: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
  },
  popularBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  popularText: {
    ...typography.small,
    color: colors.primaryDark,
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  price: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  imageWrap: {
    width: 96,
    alignItems: "center",
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  addButton: {
    position: "absolute",
    bottom: -12,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  stepper: {
    position: "absolute",
    bottom: -14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 8,
  },
  stepperButton: {
    padding: 2,
  },
  stepperValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    minWidth: 16,
    textAlign: "center",
  },
});
