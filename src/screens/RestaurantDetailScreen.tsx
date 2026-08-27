import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MenuItemRow } from "@/components/MenuItemRow";
import { RatingBadge } from "@/components/RatingBadge";
import { useCart } from "@/context/CartContext";
import { findRestaurantById } from "@/data/restaurants";
import { RootStackParamList } from "@/navigation/types";
import { colors } from "@/theme/colors";
import { radius, spacing, typography } from "@/theme/spacing";

type Props = NativeStackScreenProps<RootStackParamList, "RestaurantDetail">;

export const RestaurantDetailScreen = ({ route, navigation }: Props) => {
  const { restaurantId } = route.params;
  const restaurant = findRestaurantById(restaurantId);
  const { lines, restaurantId: cartRestaurantId, addItem, incrementItem, decrementItem, itemCount, subtotal, clearCart } =
    useCart();

  const quantityFor = (itemId: string) =>
    lines.find((l) => l.item.id === itemId)?.quantity ?? 0;

  const popularItems = useMemo(
    () => restaurant?.menu.filter((m) => m.isPopular) ?? [],
    [restaurant]
  );

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Restaurant not found.</Text>
      </SafeAreaView>
    );
  }

  const handleAdd = (itemId: string) => {
    const item = restaurant.menu.find((m) => m.id === itemId);
    if (!item) return;
    if (cartRestaurantId && cartRestaurantId !== restaurant.id && lines.length > 0) {
      Alert.alert(
        "Start a new cart?",
        "Your cart has items from another restaurant. Adding this item will clear your current cart.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Start New Cart",
            style: "destructive",
            onPress: () => {
              clearCart();
              addItem(restaurant.id, item);
            },
          },
        ]
      );
      return;
    }
    addItem(restaurant.id, item);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={restaurant.menu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.heroWrap}>
              <Image source={{ uri: restaurant.image }} style={styles.heroImage} />
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.name}>{restaurant.name}</Text>
              <Text style={styles.cuisines}>{restaurant.cuisines.join(" · ")}</Text>
              <View style={styles.metaRow}>
                <RatingBadge rating={restaurant.rating} />
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>
                  {restaurant.ratingCount.toLocaleString()} ratings
                </Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>{restaurant.deliveryTimeMinutes} min</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.metaText}>
                  {restaurant.deliveryFee === 0
                    ? "Free delivery"
                    : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
                </Text>
              </View>
            </View>

            {popularItems.length > 0 && (
              <Text style={styles.sectionTitle}>Most popular</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <MenuItemRow
            item={item}
            quantityInCart={quantityFor(item.id)}
            onAdd={() => handleAdd(item.id)}
            onIncrement={() => incrementItem(item.id)}
            onDecrement={() => decrementItem(item.id)}
          />
        )}
      />
      {itemCount > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Cart")}
        >
          <View style={styles.cartCountBadge}>
            <Text style={styles.cartCountText}>{itemCount}</Text>
          </View>
          <Text style={styles.cartBarLabel}>View Cart</Text>
          <Text style={styles.cartBarTotal}>${subtotal.toFixed(2)}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xxl * 2,
  },
  heroWrap: {
    height: 220,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.surface,
  },
  backButton: {
    position: "absolute",
    top: spacing.md,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  name: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  cuisines: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    flexWrap: "wrap",
    gap: 4,
  },
  metaDot: {
    color: colors.textMuted,
    marginHorizontal: 2,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  notFound: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
  cartBar: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cartCountBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: spacing.sm,
  },
  cartCountText: {
    color: colors.white,
    fontWeight: "700",
  },
  cartBarLabel: {
    ...typography.bodyBold,
    color: colors.white,
    flex: 1,
  },
  cartBarTotal: {
    ...typography.bodyBold,
    color: colors.white,
  },
});
