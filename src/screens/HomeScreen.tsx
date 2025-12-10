import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { Camera, History, Sparkles, Crown, User } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import { useRoomStore } from "@/state/roomStore";
import { useSession } from "@/lib/useSession";
import { useUsageStore } from "@/state/usageStore";

type Props = RootStackScreenProps<"Home">;

export default function HomeScreen() {
  const navigation = useNavigation<Props["navigation"]>();
  const insets = useSafeAreaInsets();
  const organizations = useRoomStore((state) => state.organizations);
  const { data: session } = useSession();
  const transformationsUsed = useUsageStore((state) => state.transformationsUsed);
  const isPremium = useUsageStore((state) => state.isPremium);

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF9F6" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 24, paddingHorizontal: 24 }}>
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Sparkles size={32} color="#E07A5F" strokeWidth={2} />
              <Text className="text-3xl font-bold ml-3 text-[#2F3E46]">RoomRevive</Text>
            </View>
            <View className="flex-row items-center gap-2">
              {!session && (
                <Pressable
                  onPress={() => navigation.navigate("Login")}
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
                  <User size={20} color="#2F3E46" strokeWidth={2} />
                </Pressable>
              )}
              <Pressable
                onPress={() => navigation.navigate("Subscription")}
                className="active:scale-90"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#E07A5F",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Crown size={18} color="#FFF" strokeWidth={2} fill="#FFF" />
                <Text className="text-white font-semibold ml-1 text-sm">Premium</Text>
              </Pressable>
            </View>
          </View>
          <Text className="text-base text-[#2F3E46]/60 leading-relaxed">
            Transform your space with AI-powered organization tips
          </Text>

          {/* Usage Info */}
          {!isPremium && (
            <View className="mt-3 flex-row items-center">
              <View
                style={{
                  backgroundColor: transformationsUsed >= 1 ? "#EF4444/10" : "#81B29A/10",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    color: transformationsUsed >= 1 ? "#EF4444" : "#81B29A",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {transformationsUsed >= 1
                    ? "Free trial used - Subscribe for unlimited"
                    : "1 free transformation remaining"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Main Action Card */}
        <View className="px-6 mt-8">
          <Pressable
            onPress={() => navigation.navigate("CategorySelection")}
            className="active:scale-[0.98]"
            style={{ borderRadius: 24, overflow: "hidden", elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 }}
          >
            <LinearGradient
              colors={["#E07A5F", "#D66853"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 32, alignItems: "center" }}
            >
              <View className="bg-white/20 rounded-full p-4 mb-4">
                <Camera size={40} color="#FFF" strokeWidth={2} />
              </View>
              <Text className="text-2xl font-bold text-white mb-2">Organize a Room</Text>
              <Text className="text-white/90 text-center text-base">
                Take a photo and let AI show you how to make it cozy
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* History Section */}
        {organizations.length > 0 && (
          <View className="px-6 mt-10">
            <View className="flex-row items-center mb-4">
              <History size={24} color="#2F3E46" strokeWidth={2} />
              <Text className="text-xl font-bold ml-2 text-[#2F3E46]">Past Transformations</Text>
            </View>

            <View className="space-y-4">
              {organizations.slice(0, 5).map((org) => (
                <Pressable
                  key={org.id}
                  onPress={() => navigation.navigate("Results", { imageUri: org.originalImageUri, categoryId: org.categoryId || "room" })}
                  className="active:scale-[0.98]"
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: 16,
                    overflow: "hidden",
                    elevation: 2,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  <View className="flex-row">
                    <Image
                      source={{ uri: org.originalImageUri }}
                      style={{ width: 100, height: 100 }}
                      resizeMode="cover"
                    />
                    <View className="flex-1 p-4 justify-center">
                      <Text className="text-sm text-[#2F3E46]/60 mb-1">
                        {new Date(org.timestamp).toLocaleDateString()}
                      </Text>
                      <Text className="text-base font-semibold text-[#2F3E46]" numberOfLines={2}>
                        {org.instructions[0] || "Room Organization"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {organizations.length === 0 && (
          <View className="px-6 mt-16 items-center">
            <View className="bg-[#81B29A]/10 rounded-full p-6 mb-4">
              <Sparkles size={48} color="#81B29A" strokeWidth={1.5} />
            </View>
            <Text className="text-lg font-semibold text-[#2F3E46] mb-2">Ready to get started?</Text>
            <Text className="text-center text-[#2F3E46]/60 px-8 leading-relaxed">
              Take a photo of any room and discover how to organize it beautifully
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
