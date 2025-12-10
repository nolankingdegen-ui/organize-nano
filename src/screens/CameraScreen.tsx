import { View, Text, Pressable, Alert } from "react-native";
import { Camera, Image as ImageIcon, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import type { RootStackScreenProps } from "@/navigation/types";
import { useUsageStore } from "@/state/usageStore";

type Props = RootStackScreenProps<"Camera">;

export default function CameraScreen() {
  const navigation = useNavigation<Props["navigation"]>();
  const route = useRoute<Props["route"]>();
  const insets = useSafeAreaInsets();
  const canUseTransformation = useUsageStore((state) => state.canUseTransformation);
  const isPremium = useUsageStore((state) => state.isPremium);

  const { categoryId } = route.params;

  const checkUsageAndNavigate = (imageUri: string) => {
    if (!canUseTransformation()) {
      // Show paywall
      Alert.alert(
        "Upgrade to Premium",
        "You've used your free transformation. Subscribe to Premium for unlimited room transformations!",
        [
          {
            text: "Subscribe",
            onPress: () => navigation.navigate("Subscription"),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
      return;
    }

    navigation.navigate("Results", { imageUri, categoryId });
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required to take photos");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      checkUsageAndNavigate(result.assets[0].uri);
    }
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Photo library permission is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      checkUsageAndNavigate(result.assets[0].uri);
    }
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
          justifyContent: "space-between",
        }}
      >
        <Text className="text-2xl font-bold text-[#2F3E46]">Choose Photo</Text>
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

      {/* Options */}
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}>
        {/* Take Photo */}
        <Pressable
          onPress={handleTakePhoto}
          className="active:scale-[0.98] mb-6"
          style={{
            borderRadius: 24,
            overflow: "hidden",
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
          }}
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
            <Text className="text-2xl font-bold text-white mb-2">Take Photo</Text>
            <Text className="text-white/90 text-center text-base">
              Snap a picture of your room right now
            </Text>
          </LinearGradient>
        </Pressable>

        {/* Choose from Library */}
        <Pressable
          onPress={handlePickPhoto}
          className="active:scale-[0.98]"
          style={{
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: "#FFF",
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          <View style={{ padding: 32, alignItems: "center", borderWidth: 2, borderColor: "#E07A5F", borderRadius: 24 }}>
            <View style={{ backgroundColor: "#E07A5F", borderRadius: 50, padding: 16, marginBottom: 16 }}>
              <ImageIcon size={40} color="#FFF" strokeWidth={2} />
            </View>
            <Text className="text-2xl font-bold text-[#2F3E46] mb-2">Choose from Library</Text>
            <Text className="text-[#2F3E46]/60 text-center text-base">
              Select an existing photo from your gallery
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
