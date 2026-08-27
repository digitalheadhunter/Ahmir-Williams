import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { RootStackParamList } from "@/navigation/types";
import { colors } from "@/theme/colors";
import { spacing, typography } from "@/theme/spacing";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export const OnboardingScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Ionicons name="fast-food" size={56} color={colors.white} />
        </View>
        <Image
          source={{ uri: "https://picsum.photos/seed/onboarding-food/900/700" }}
          style={styles.heroImage}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Craving something good?</Text>
        <Text style={styles.subtitle}>
          Order from your favorite local restaurants and get it delivered fast,
          fresh, and right to your door.
        </Text>
        <PrimaryButton
          label="Get Started"
          onPress={() => navigation.replace("Signup")}
          style={styles.button}
        />
        <PrimaryButton
          label="I already have an account"
          variant="outline"
          onPress={() => navigation.replace("Login")}
          style={styles.button}
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
  hero: {
    height: "48%",
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.md,
    lineHeight: 22,
  },
  button: {
    marginTop: spacing.xl,
  },
});
