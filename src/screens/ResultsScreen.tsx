import { View, Text, Pressable, ScrollView, Image, ActivityIndicator } from "react-native";
import { ArrowLeft, Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import type { RootStackScreenProps } from "@/navigation/types";
import { useRoomStore } from "@/state/roomStore";
import { useUsageStore } from "@/state/usageStore";
import { getCategoryPrompt, getCategoryLabel } from "@/constants/categories";

type Props = RootStackScreenProps<"Results">;

export default function ResultsScreen() {
  const navigation = useNavigation<Props["navigation"]>();
  const route = useRoute<Props["route"]>();
  const insets = useSafeAreaInsets();
  const addOrganization = useRoomStore((state) => state.addOrganization);
  const incrementUsage = useUsageStore((state) => state.incrementUsage);

  const [loading, setLoading] = useState(true);
  const [organizedImageUri, setOrganizedImageUri] = useState<string>("");
  const [instructions, setInstructions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<string>("Analyzing your room...");

  const { imageUri, categoryId } = route.params;

  useEffect(() => {
    processImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processImage = async () => {
    try {
      setLoading(true);
      setError("");

      const apiKey = process.env.EXPO_PUBLIC_VIBECODE_GOOGLE_API_KEY;
      if (!apiKey) {
        setError("Nano Banana Pro API is not configured. Please contact support.");
        setLoading(false);
        return;
      }

      // Read image as base64
      setProgress("Reading your photo...");
      const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Step 1: Analyze the room and generate instructions using Nano Banana Pro
      setProgress("Analyzing room layout and organization...");
      const categoryPrompt = getCategoryPrompt(categoryId as any);
      const instructionsResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a professional interior designer and organization expert. Analyze this ${categoryPrompt} photo carefully and provide 5-7 specific, actionable steps to organize and improve it. Be practical, specific, and considerate of the existing space. Format your response as a numbered list with clear, concise steps. Focus on realistic improvements like decluttering, furniture arrangement, lighting, decor, and creating functional zones appropriate for this type of space.`,
                  },
                  {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: imageBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["Text"],
            },
          }),
        }
      );

      const instructionsData = await instructionsResponse.json();
      const instructionsText =
        instructionsData.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const parsedInstructions = instructionsText
        .split("\n")
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "").trim())
        .filter((line: string) => line.length > 15);

      setInstructions(parsedInstructions);

      // Step 2: Generate the organized room image
      setProgress("Generating your organized room vision... (this takes ~30 seconds)");
      const imageResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Transform this ${categoryPrompt} into a beautifully organized, functional, and aesthetically pleasing space. Keep the same layout, walls, windows, and overall architecture. Show it clean, well-organized with improved arrangement, warm ambient lighting, appropriate decor, and create a welcoming atmosphere suitable for this type of space. Make it look realistic and achievable. Photorealistic style, high quality interior design.`,
                  },
                  {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: imageBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ["Image"],
              imageConfig: {
                aspectRatio: "1:1",
                imageSize: "2K",
              },
            },
          }),
        }
      );

      const imageData = await imageResponse.json();
      const imagePart = imageData.candidates?.[0]?.content?.parts?.find(
        (p: { inlineData?: { data: string } }) => p.inlineData
      );

      if (!imagePart) {
        throw new Error("No image generated by Nano Banana Pro");
      }

      // Save generated image locally
      const base64Image = imagePart.inlineData.data;
      const generatedFileUri = FileSystem.documentDirectory + `organized_${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(generatedFileUri, base64Image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setOrganizedImageUri(generatedFileUri);

      // Save to history
      const organization = {
        id: Date.now().toString(),
        originalImageUri: imageUri,
        organizedImageUri: generatedFileUri,
        instructions: parsedInstructions,
        timestamp: Date.now(),
        categoryId: categoryId,
      };
      addOrganization(organization);

      // Increment usage count after successful transformation
      incrementUsage();

      setLoading(false);
    } catch (err) {
      console.error("Error processing image:", err);
      setError(
        "Failed to process the image. The AI service may be temporarily unavailable. Please try again."
      );
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
          <Text className="text-xl font-bold text-[#2F3E46] mb-2">Nano Banana at work...</Text>
          <Text className="text-center text-[#2F3E46]/60 leading-relaxed px-4">{progress}</Text>
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
