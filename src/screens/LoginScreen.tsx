import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { LogIn, Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { useSession } from "@/lib/useSession";
import { authClient } from "@/lib/authClient";
import type { RootStackScreenProps } from "@/navigation/types";

type Props = RootStackScreenProps<"Login">;

// This is required for Google OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation<Props["navigation"]>();
  const insets = useSafeAreaInsets();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      // Get the backend URL
      const backendUrl = process.env.EXPO_PUBLIC_VIBECODE_BACKEND_URL || "http://localhost:3000";
      const googleAuthUrl = `${backendUrl}/api/auth/sign-in/google`;

      // Open Google OAuth in browser
      const result = await WebBrowser.openAuthSessionAsync(
        googleAuthUrl,
        "vibecode://auth/callback"
      );

      if (result.type === "success") {
        // Session should be automatically synced via Better Auth
        Alert.alert("Success!", "You're now signed in!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else if (result.type === "cancel") {
        // User cancelled
        setLoading(false);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      Alert.alert("Sign In Failed", "Please try again later.");
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  // If already logged in, show signed in state
  if (session) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAF9F6" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          <View className="bg-[#81B29A]/10 rounded-full p-6 mb-4">
            <Sparkles size={48} color="#81B29A" strokeWidth={1.5} />
          </View>
          <Text className="text-2xl font-bold text-[#2F3E46] mb-2">You&apos;re signed in!</Text>
          <Text className="text-center text-[#2F3E46]/60 mb-8 leading-relaxed">
            Welcome back, {session.user.name || session.user.email}
          </Text>

          <Pressable
            onPress={handleSkip}
            className="active:scale-95"
            style={{
              backgroundColor: "#E07A5F",
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 16,
            }}
          >
            <Text className="text-white font-semibold text-base">Continue</Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              await authClient.signOut();
              navigation.goBack();
            }}
            className="active:scale-95 mt-4"
          >
            <Text className="text-[#2F3E46]/60 text-base">Sign Out</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF9F6" }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* Logo/Icon */}
        <LinearGradient
          colors={["#E07A5F", "#D66853"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <Sparkles size={50} color="#FFF" strokeWidth={2} />
        </LinearGradient>

        {/* Header */}
        <Text className="text-3xl font-bold text-[#2F3E46] mb-3 text-center">Welcome to RoomRevive</Text>
        <Text className="text-center text-[#2F3E46]/60 mb-12 leading-relaxed text-base">
          Sign in to save your transformations and sync across devices
        </Text>

        {/* Google Sign-In Button */}
        <Pressable
          onPress={handleGoogleSignIn}
          disabled={loading}
          className="active:scale-[0.98] w-full mb-4"
          style={{
            borderRadius: 16,
            overflow: "hidden",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <LinearGradient
            colors={["#E07A5F", "#D66853"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingVertical: 18,
              paddingHorizontal: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <LogIn size={22} color="#FFF" strokeWidth={2} />
                <Text className="text-white font-bold text-lg ml-2">Sign in with Google</Text>
              </>
            )}
          </LinearGradient>
        </Pressable>

        {/* Skip Button */}
        <Pressable
          onPress={handleSkip}
          disabled={loading}
          className="active:scale-95"
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          <Text className="text-[#2F3E46]/60 text-base">Skip for now</Text>
        </Pressable>

        {/* Footer */}
        <View className="absolute bottom-8 px-8">
          <Text className="text-center text-[#2F3E46]/40 text-xs leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </View>
  );
}
