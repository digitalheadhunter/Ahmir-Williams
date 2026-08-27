import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { findRestaurantById } from "@/data/restaurants";
import { RootStackParamList } from "@/navigation/types";
import { colors } from "@/theme/colors";
import { radius, spacing, typography } from "@/theme/spacing";

type Props = NativeStackScreenProps<RootStackParamList, "Checkout">;

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "card-outline" as const },
  { id: "cash", label: "Cash on Delivery", icon: "cash-outline" as const },
  { id: "wallet", label: "Wallet", icon: "wallet-outline" as const },
];

const DELIVERY_FEE_FALLBACK = 1.99;
const SERVICE_FEE = 0.99;

export const CheckoutScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const { lines, restaurantId, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const restaurant = restaurantId ? findRestaurantById(restaurantId) : undefined;
  const deliveryFee = restaurant?.deliveryFee ?? DELIVERY_FEE_FALLBACK;
  const total = subtotal + deliveryFee + SERVICE_FEE;

  const [selectedPayment, setSelectedPayment] = useState("card");
  const [placing, setPlacing] = useState(false);

  const address = user?.addresses?.[0];

  const handlePlaceOrder = async () => {
    if (!restaurant || !address) return;
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        lines,
        total,
        address,
      });
      clearCart();
      setPlacing(false);
      navigation.replace("OrderTracking", { orderId: order.id });
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Delivery address</Text>
        <View style={styles.card}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardTitle}>{address?.label ?? "No address"}</Text>
            <Text style={styles.cardSubtitle}>
              {address ? `${address.line1}, ${address.city}` : "Add an address in your profile"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Payment method</Text>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentRow,
              selectedPayment === method.id && styles.paymentRowSelected,
            ]}
            onPress={() => setSelectedPayment(method.id)}
          >
            <Ionicons name={method.icon} size={20} color={colors.textPrimary} />
            <Text style={styles.paymentLabel}>{method.label}</Text>
            <Ionicons
              name={selectedPayment === method.id ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={selectedPayment === method.id ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>Order summary</Text>
        <View style={styles.summaryCard}>
          {lines.map((line) => (
            <View key={line.item.id} style={styles.summaryLine}>
              <Text style={styles.summaryLineText}>
                {line.quantity}x {line.item.name}
              </Text>
              <Text style={styles.summaryLineValue}>
                ${(line.quantity * line.item.price).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLineText}>Subtotal</Text>
            <Text style={styles.summaryLineValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLineText}>Delivery fee</Text>
            <Text style={styles.summaryLineValue}>
              {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.summaryLine}>
            <Text style={styles.summaryLineText}>Service fee</Text>
            <Text style={styles.summaryLineValue}>${SERVICE_FEE.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryLine}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={`Place Order · $${total.toFixed(2)}`}
          onPress={handlePlaceOrder}
          loading={placing}
          disabled={lines.length === 0 || !address}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  paymentRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  paymentLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  summaryLineText: {
    ...typography.body,
    color: colors.textSecondary,
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  summaryLineValue: {
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
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
