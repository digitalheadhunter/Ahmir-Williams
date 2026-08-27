import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useOrders } from "@/context/OrdersContext";
import { RootStackParamList } from "@/navigation/types";
import { OrderStatus } from "@/types";
import { colors } from "@/theme/colors";
import { radius, spacing, typography } from "@/theme/spacing";

type Props = NativeStackScreenProps<RootStackParamList, "OrderTracking">;

const STEPS: { key: OrderStatus; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "placed", label: "Order placed", icon: "receipt-outline" },
  { key: "confirmed", label: "Confirmed", icon: "checkmark-circle-outline" },
  { key: "preparing", label: "Preparing your food", icon: "restaurant-outline" },
  { key: "out_for_delivery", label: "Out for delivery", icon: "bicycle-outline" },
  { key: "delivered", label: "Delivered", icon: "home-outline" },
];

export const OrderTrackingScreen = ({ route, navigation }: Props) => {
  const { orderId } = route.params;
  const { getOrder } = useOrders();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Order not found.</Text>
      </SafeAreaView>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.restaurantRow}>
          <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
          <View>
            <Text style={styles.restaurantName}>{order.restaurantName}</Text>
            <Text style={styles.orderId}>Order #{order.id.slice(-6).toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.timeline}>
          {STEPS.map((step, index) => {
            const isDone = index <= currentIndex;
            const isLast = index === STEPS.length - 1;
            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineIconColumn}>
                  <View style={[styles.timelineIcon, isDone && styles.timelineIconDone]}>
                    <Ionicons
                      name={step.icon}
                      size={16}
                      color={isDone ? colors.white : colors.textMuted}
                    />
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineConnector,
                        index < currentIndex && styles.timelineConnectorDone,
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    isDone ? styles.timelineLabelDone : styles.timelineLabelPending,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        {order.status !== "delivered" ? (
          <View style={styles.etaBanner}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={styles.etaText}>
              Estimated arrival in {Math.max(1, (STEPS.length - 1 - currentIndex) * 6)} minutes
            </Text>
          </View>
        ) : (
          <View style={[styles.etaBanner, styles.deliveredBanner]}>
            <Ionicons name="checkmark-done" size={18} color={colors.success} />
            <Text style={[styles.etaText, { color: colors.success }]}>
              Delivered — enjoy your meal!
            </Text>
          </View>
        )}

        <View style={styles.addressCard}>
          <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.addressText}>
            {order.address.line1}, {order.address.city}
          </Text>
        </View>

        <View style={styles.itemsCard}>
          <Text style={styles.itemsTitle}>Items</Text>
          {order.lines.map((line) => (
            <View key={line.item.id} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {line.quantity}x {line.item.name}
              </Text>
              <Text style={styles.itemPrice}>
                ${(line.quantity * line.item.price).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.itemRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Back to Home"
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] })
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  restaurantImage: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  restaurantName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  orderId: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timeline: {
    marginTop: spacing.xl,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineIconColumn: {
    alignItems: "center",
    marginRight: spacing.md,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineIconDone: {
    backgroundColor: colors.primary,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    minHeight: 24,
    backgroundColor: colors.border,
  },
  timelineConnectorDone: {
    backgroundColor: colors.primary,
  },
  timelineLabel: {
    ...typography.body,
    paddingTop: spacing.sm,
  },
  timelineLabelDone: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  timelineLabelPending: {
    color: colors.textMuted,
  },
  etaBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  deliveredBanner: {
    backgroundColor: "#E6F7EF",
  },
  etaText: {
    ...typography.bodyBold,
    color: colors.primaryDark,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  addressText: {
    ...typography.body,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  itemsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemsTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  itemText: {
    ...typography.body,
    color: colors.textSecondary,
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  itemPrice: {
    ...typography.body,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  notFound: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
