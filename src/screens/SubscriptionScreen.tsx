import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { X, Sparkles, Check, Zap } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import type { RootStackScreenProps } from "@/navigation/types";
import {
  isRevenueCatEnabled,
  getOfferings,
  purchasePackage,
  restorePurchases,
  hasEntitlement,
} from "@/lib/revenuecatClient";
import type { PurchasesPackage } from "react-native-purchases";
import { useUsageStore } from "@/state/usageStore";

type Props = RootStackScreenProps<"Subscription">;

export default function SubscriptionScreen() {
  const navigation = useNavigation<Props["navigation"]>();
  const insets = useSafeAreaInsets();
  const setPremium = useUsageStore((state) => state.setPremium);

  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);

  useEffect(() => {
    loadOfferings();
    checkPremiumStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPremiumStatus = async () => {
    const result = await hasEntitlement("premium");
    if (result.ok) {
      setPremium(result.data);
    }
  };

  const loadOfferings = async () => {
    if (!isRevenueCatEnabled()) {
      setLoading(false);
      return;
    }

    const offeringsResult = await getOfferings();
    if (offeringsResult.ok && offeringsResult.data.current) {
      const packages = offeringsResult.data.current.availablePackages;
      const monthly = packages.find((pkg) => pkg.identifier === "$rc_monthly");
      setMonthlyPackage(monthly || null);
    }
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!monthlyPackage) return;

    setPurchasing(true);
    const result = await purchasePackage(monthlyPackage);
    setPurchasing(false);

    if (result.ok) {
      // Update premium status
      setPremium(true);

      Alert.alert("Success!", "Welcome to RoomRevive Premium!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      if (result.reason !== "sdk_error") {
        Alert.alert("Unable to purchase", "Please try again later.");
      }
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);
    const result = await restorePurchases();
    setPurchasing(false);

    if (result.ok) {
      Alert.alert("Restored", "Your purchases have been restored!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("No purchases found", "You don't have any previous purchases to restore.");
    }
  };

  const features = [
    "Unlimited room transformations",
    "High-quality 2K AI-generated images",
    "Priority AI processing",
    "Save unlimited history",
    "Export before/after images",
    "Ad-free experience",
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAF9F6" }}>
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text className="text-2xl font-bold text-[#2F3E46]">Premium</Text>
          <Pressable onPress={() => navigation.goBack()} className="active:scale-90">
            <X size={24} color="#2F3E46" strokeWidth={2} />
          </Pressable>
        </View>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#E07A5F" />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF9F6" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <Text className="text-2xl font-bold text-[#2F3E46]">Go Premium</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            className="active:scale-90"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#2F3E46/10",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={24} color="#2F3E46" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Hero Section */}
        <View className="px-6 mb-8">
          <LinearGradient
            colors={["#E07A5F", "#D66853"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 32,
              alignItems: "center",
            }}
          >
            <View className="bg-white/20 rounded-full p-4 mb-4">
              <Zap size={48} color="#FFF" strokeWidth={2} fill="#FFF" />
            </View>
            <Text className="text-3xl font-bold text-white mb-2 text-center">
              Unlimited Transformations
            </Text>
            <Text className="text-white/90 text-center text-base leading-relaxed">
              Transform as many rooms as you want with premium AI power
            </Text>
          </LinearGradient>
        </View>

        {/* Features */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-[#2F3E46] mb-4">What&apos;s Included</Text>
          <View className="space-y-3">
            {features.map((feature, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#81B29A",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Check size={20} color="#FFF" strokeWidth={3} />
                </View>
                <Text className="flex-1 text-base text-[#2F3E46]">{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing */}
        {monthlyPackage && (
          <View className="px-6 mb-6">
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 24,
                padding: 24,
                borderWidth: 3,
                borderColor: "#E07A5F",
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
              }}
            >
              <View className="items-center mb-4">
                <Text className="text-base text-[#2F3E46]/60 mb-1">Monthly Subscription</Text>
                <View className="flex-row items-end">
                  <Text className="text-5xl font-bold text-[#2F3E46]">
                    {monthlyPackage.product.priceString}
                  </Text>
                  <Text className="text-xl text-[#2F3E46]/60 mb-2 ml-2">/month</Text>
                </View>
                <Text className="text-sm text-[#2F3E46]/60 mt-2">Cancel anytime</Text>
              </View>

              <Pressable
                onPress={handlePurchase}
                disabled={purchasing}
                className="active:scale-[0.98]"
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["#E07A5F", "#D66853"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 18,
                    alignItems: "center",
                    opacity: purchasing ? 0.6 : 1,
                  }}
                >
                  {purchasing ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Text className="text-white font-bold text-lg">Subscribe Now</Text>
                      <Text className="text-white/80 text-sm mt-1">Start your premium experience</Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        )}

        {/* Restore Button */}
        <View className="px-6 mb-4">
          <Pressable
            onPress={handleRestore}
            disabled={purchasing}
            className="active:scale-95"
            style={{ opacity: purchasing ? 0.6 : 1 }}
          >
            <Text className="text-center text-[#2F3E46]/60 text-base">Restore Purchases</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="px-6">
          <Text className="text-center text-[#2F3E46]/40 text-xs leading-relaxed">
            Subscription automatically renews unless cancelled at least 24 hours before the end of the
            current period.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
