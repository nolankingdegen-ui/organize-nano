import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import HomeScreen from "@/screens/HomeScreen";
import CategorySelectionScreen from "@/screens/CategorySelectionScreen";
import CameraScreen from "@/screens/CameraScreen";
import ResultsScreen from "@/screens/ResultsScreen";
import SubscriptionScreen from "@/screens/SubscriptionScreen";
import LoginScreen from "@/screens/LoginScreen";

/**
 * RootStackNavigator
 * Simple stack navigator for the room organization app
 */
const RootStack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen name="CategorySelection" component={CategorySelectionScreen} />
      <RootStack.Screen name="Camera" component={CameraScreen} />
      <RootStack.Screen name="Results" component={ResultsScreen} />
      <RootStack.Screen name="Subscription" component={SubscriptionScreen} />
      <RootStack.Screen name="Login" component={LoginScreen} options={{ presentation: "modal" }} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
