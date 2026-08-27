import { Ionicons } from "@expo/vector-icons";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryPill } from "@/components/CategoryPill";
import { RestaurantCard } from "@/components/RestaurantCard";
import { useAuth } from "@/context/AuthContext";
import { categories } from "@/data/categories";
import { restaurants } from "@/data/restaurants";
import { MainTabParamList, RootStackParamList } from "@/navigation/types";
import { colors } from "@/theme/colors";
import { spacing, typography } from "@/theme/spacing";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRestaurants = useMemo(() => {
    if (selectedCategory === "all") return restaurants;
    return restaurants.filter((r) => r.categoryIds.includes(selectedCategory));
  }, [selectedCategory]);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>Hey {firstName} 👋</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color={colors.primary} />
                  <Text style={styles.locationText}>
                    {user?.addresses?.[0]?.line1 ?? "Set your address"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => navigation.navigate("Search")}
              >
                <Ionicons name="search" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.searchBar}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Search")}
            >
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <Text style={styles.searchPlaceholder}>
                Search restaurants or dishes
              </Text>
            </TouchableOpacity>

            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => (
                <CategoryPill
                  category={item}
                  selected={selectedCategory === item.id}
                  onPress={() => setSelectedCategory(item.id)}
                />
              )}
            />

            <Text style={styles.sectionTitle}>
              {selectedCategory === "all"
                ? "All restaurants"
                : categories.find((c) => c.id === selectedCategory)?.name}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() =>
              navigation.navigate("RestaurantDetail", { restaurantId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No restaurants in this category yet.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: spacing.md,
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    height: 48,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    ...typography.body,
    color: colors.textMuted,
  },
  categoryList: {
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
});
