import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CartLine } from "@/types";
import { colors } from "@/theme/colors";
import { radius, spacing, typography } from "@/theme/spacing";

type Props = {
  line: CartLine;
  onIncrement: () => void;
  onDecrement: () => void;
};

export const CartItemRow = ({ line, onIncrement, onDecrement }: Props) => {
  return (
    <View style={styles.row}>
      <Image source={{ uri: line.item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {line.item.name}
        </Text>
        <Text style={styles.price}>${line.item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity onPress={onDecrement} style={styles.stepperButton}>
          <Ionicons
            name={line.quantity === 1 ? "trash-outline" : "remove"}
            size={16}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{line.quantity}</Text>
        <TouchableOpacity onPress={onIncrement} style={styles.stepperButton}>
          <Ionicons name="add" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  details: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  price: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
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
