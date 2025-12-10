import { View, Text, Pressable, ScrollView } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import { ROOM_CATEGORIES } from "@/constants/categories";

type Props = RootStackScreenProps<"CategorySelection">;

export default function CategorySelectionScreen() {
  const navigation = useNavigation<Props["navigation"]>();
  const insets = useSafeAreaInsets();

  const handleCategorySelect = (categoryId: string) => {
    navigation.navigate("Camera", { categoryId });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF9F6" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Pressable onPress={() => navigation.goBack()} className="active:scale-90 mr-4">
          <ArrowLeft size={24} color="#2F3E46" strokeWidth={2} />
        </Pressable>
        <Text className="text-2xl font-bold text-[#2F3E46]">Choose a Space</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[#2F3E46]/60 mb-6 text-base leading-relaxed">
          Select the type of space you want to organize
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {ROOM_CATEGORIES.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => handleCategorySelect(category.id)}
              className="active:scale-95"
              style={{
                width: "48%",
                backgroundColor: "#FFF",
                borderRadius: 20,
                padding: 20,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                minHeight: 120,
                borderWidth: 2,
                borderColor: "transparent",
              }}
            >
              <Text style={{ fontSize: 40, marginBottom: 8 }}>{category.icon}</Text>
              <Text className="text-[#2F3E46] text-center font-semibold text-sm leading-snug">
                {category.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
