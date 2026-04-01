import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { OddOneOutScreen } from '@/features/oddOneOut/screens/OddOneOutScreen';
import { RememberColorScreen } from '@/features/rememberColor/screens/RememberColorScreen';
import { ResultScreen } from '@/features/result/screens/ResultScreen';
import { SettingsScreen } from '@/features/settings/screens/SettingsScreen';
import type { RootStackParamList } from '@/navigation/types';
import themeColors from '@/theme/colors.json';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: themeColors.surface.DEFAULT },
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="OddOneOut"
          component={OddOneOutScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="RememberColor"
          component={RememberColorScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
