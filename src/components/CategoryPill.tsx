import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Category } from "@/types";
import { colors } from "@/theme/colors";
import { radius, spacing, typography } from "@/theme/spacing";

type Props = {
  category: Category;
  selected: boolean;
  onPress: () => void;
};

export const CategoryPill = ({ category, selected, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.pillSelected]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons
        name={category.icon as any}
        size={16}
        color={selected ? colors.white : colors.textSecondary}
      />
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  labelSelected: {
    color: colors.white,
  },
});
