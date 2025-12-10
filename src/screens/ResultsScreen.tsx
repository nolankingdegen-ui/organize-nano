import { View, Text, Pressable, ScrollView, Image, ActivityIndicator } from "react-native";
import { ArrowLeft, Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import type { RootStackScreenProps } from "@/navigation/types";
import { useRoomStore } from "@/state/roomStore";
import OpenAI from "openai";

type Props = RootStackScreenProps<"Results">;

export default function ResultsScreen() {
  const navigation = useNavigation<Props["navigation"]>();
  const route = useRoute<Props["route"]>();
  const insets = useSafeAreaInsets();
  const addOrganization = useRoomStore((state) => state.addOrganization);

  const [loading, setLoading] = useState(true);
  const [organizedImageUri, setOrganizedImageUri] = useState<string>("");
  const [instructions, setInstructions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const { imageUri } = route.params;

  useEffect(() => {
    processImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processImage = async () => {
    try {
      setLoading(true);
      setError("");

      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      if (!apiKey) {
        setError("Please add your OpenAI API key in the ENV tab to use this feature");
        setLoading(false);
        return;
      }

      const openai = new OpenAI({ apiKey });

      // Generate instructions using GPT-4
      const instructionsResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this room photo and provide 5-7 specific, actionable steps to organize and make it more cozy. Be practical and specific. Format as a simple list.",
              },
              {
                type: "image_url",
                image_url: { url: imageUri },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      const instructionsText = instructionsResponse.choices[0]?.message?.content || "";
      const parsedInstructions = instructionsText
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "").trim())
        .filter((line) => line.length > 10);

      setInstructions(parsedInstructions);

      // Generate organized room image using DALL-E
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Transform this room into an organized, cozy, and aesthetically pleasing space. Keep the same room layout and architecture, but show it clean, organized, with better furniture arrangement, soft lighting, plants, and warm decor. Photorealistic style.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      const generatedImageUrl = imageResponse.data?.[0]?.url;
      if (generatedImageUrl) {
        setOrganizedImageUri(generatedImageUrl);

        // Save to history
        const organization = {
          id: Date.now().toString(),
          originalImageUri: imageUri,
          organizedImageUri: generatedImageUrl,
          instructions: parsedInstructions,
          timestamp: Date.now(),
        };
        addOrganization(organization);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process the image. Please check your API key and try again.");
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAF9F6" }}>
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => navigation.goBack()} className="active:scale-90 mr-4">
            <ArrowLeft size={24} color="#2F3E46" strokeWidth={2} />
          </Pressable>
          <Text className="text-2xl font-bold text-[#2F3E46]">Error</Text>
        </View>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
          <View className="bg-red-100 rounded-full p-6 mb-4">
            <Sparkles size={48} color="#EF4444" strokeWidth={1.5} />
          </View>
          <Text className="text-lg font-semibold text-[#2F3E46] mb-2 text-center">Oops!</Text>
          <Text className="text-center text-[#2F3E46]/60 mb-6 leading-relaxed">{error}</Text>
          <Pressable
            onPress={() => navigation.goBack()}
            className="active:scale-95"
            style={{
              backgroundColor: "#E07A5F",
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 16,
            }}
          >
            <Text className="text-white font-semibold text-base">Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAF9F6" }}>
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => navigation.goBack()} className="active:scale-90 mr-4">
            <ArrowLeft size={24} color="#2F3E46" strokeWidth={2} />
          </Pressable>
          <Text className="text-2xl font-bold text-[#2F3E46]">Processing...</Text>
        </View>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
          <LinearGradient
            colors={["#E07A5F", "#D66853"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <ActivityIndicator size="large" color="#FFF" />
          </LinearGradient>
          <Text className="text-xl font-bold text-[#2F3E46] mb-2">Creating magic...</Text>
          <Text className="text-center text-[#2F3E46]/60 leading-relaxed">
            AI is analyzing your room and generating organization tips
          </Text>
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
            marginBottom: 24,
          }}
        >
          <Pressable onPress={() => navigation.goBack()} className="active:scale-90 mr-4">
            <ArrowLeft size={24} color="#2F3E46" strokeWidth={2} />
          </Pressable>
          <Text className="text-2xl font-bold text-[#2F3E46]">Your Transformation</Text>
        </View>

        {/* Before/After Images */}
        <View className="px-6 mb-8">
          <View className="mb-4">
            <Text className="text-sm font-semibold text-[#2F3E46]/60 mb-2 uppercase tracking-wide">
              Before
            </Text>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: "100%",
                height: 240,
                borderRadius: 16,
              }}
              resizeMode="cover"
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-[#2F3E46]/60 mb-2 uppercase tracking-wide">
              After (AI Vision)
            </Text>
            <Image
              source={{ uri: organizedImageUri }}
              style={{
                width: "100%",
                height: 240,
                borderRadius: 16,
              }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Instructions */}
        <View className="px-6">
          <View className="flex-row items-center mb-4">
            <Sparkles size={24} color="#E07A5F" strokeWidth={2} />
            <Text className="text-xl font-bold ml-2 text-[#2F3E46]">How to Get There</Text>
          </View>

          <View className="space-y-4">
            {instructions.map((instruction, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 16,
                  padding: 20,
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  marginBottom: 12,
                }}
              >
                <View className="flex-row">
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "#E07A5F",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text className="text-white font-bold">{index + 1}</Text>
                  </View>
                  <Text className="flex-1 text-base text-[#2F3E46] leading-relaxed">{instruction}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
