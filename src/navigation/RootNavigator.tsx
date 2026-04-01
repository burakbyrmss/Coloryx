import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { OddOneOutScreen } from '@/features/oddOneOut/screens/OddOneOutScreen';
import { RememberColorScreen } from '@/features/rememberColor/screens/RememberColorScreen';
import { RememberGuessScreen } from '@/features/rememberColor/screens/RememberGuessScreen';
import { RememberRoundResultScreen } from '@/features/rememberColor/screens/RememberRoundResultScreen';
import { OddOneOutResultScreen } from '@/features/result/screens/OddOneOutResultScreen';
import { RememberColorResultScreen } from '@/features/result/screens/RememberColorResultScreen';
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
        <Stack.Screen
          name="RememberGuess"
          component={RememberGuessScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="RememberRoundResult"
          component={RememberRoundResultScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="RememberColorResult"
          component={RememberColorResultScreen}
        />
        <Stack.Screen
          name="OddOneOutResult"
          component={OddOneOutResultScreen}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
