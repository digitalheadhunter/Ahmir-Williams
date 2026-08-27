import { Ionicons } from "@expo/vector-icons";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "@/context/OrdersContext";
import { MainTabParamList, RootStackParamList } from "@/navigation/types";
import { Order } from "@/types";
import { colors } from "@/theme/colors";
import { radius, spacing, typography } from "@/theme/spacing";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Orders">,
  NativeStackScreenProps<RootStackParamList>
>;

const STATUS_LABEL: Record<Order["status"], string> = {
  placed: "Order placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export const OrderHistoryScreen = ({ navigation }: Props) => {
  const { orders } = useOrders();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Your Orders</Text>
      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            Your past orders will show up here once you place one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("OrderTracking", { orderId: item.id })}
            >
              <Image source={{ uri: item.restaurantImage }} style={styles.orderImage} />
              <View style={styles.orderDetails}>
                <Text style={styles.orderRestaurant}>{item.restaurantName}</Text>
                <Text style={styles.orderItems} numberOfLines={1}>
                  {item.lines.map((l) => `${l.quantity}x ${l.item.name}`).join(", ")}
                </Text>
                <View style={styles.orderMetaRow}>
                  <Text
                    style={[
                      styles.orderStatus,
                      item.status === "delivered" && styles.orderStatusDelivered,
                    ]}
                  >
                    {STATUS_LABEL[item.status]}
                  </Text>
                  <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  orderImage: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  orderDetails: {
    flex: 1,
  },
  orderRestaurant: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  orderItems: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  orderMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  orderStatus: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "700",
  },
  orderStatusDelivered: {
    color: colors.success,
  },
  orderTotal: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "700",
  },
});
