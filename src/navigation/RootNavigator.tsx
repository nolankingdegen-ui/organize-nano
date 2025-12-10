import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import HomeScreen from "@/screens/HomeScreen";
import CameraScreen from "@/screens/CameraScreen";
import ResultsScreen from "@/screens/ResultsScreen";
import SubscriptionScreen from "@/screens/SubscriptionScreen";

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
      <RootStack.Screen name="Camera" component={CameraScreen} />
      <RootStack.Screen name="Results" component={ResultsScreen} />
      <RootStack.Screen name="Subscription" component={SubscriptionScreen} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
