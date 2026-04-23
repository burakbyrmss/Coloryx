import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LeaderboardsScreen } from '@/features/leaderboards/screens/LeaderboardsScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { TemporaryTitleScreen } from '@/features/home/screens/TemporaryTitleScreen';
import { NameSetupScreen } from '@/features/onboarding/screens/NameSetupScreen';
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

type RootNavigatorProps = {
  initialRouteName: keyof RootStackParamList;
};

export function RootNavigator({ initialRouteName }: RootNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: themeColors.surface.DEFAULT },
        }}>
        <Stack.Screen name="NameSetup" component={NameSetupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TemporaryTitle" component={TemporaryTitleScreen} />
        <Stack.Screen name="Leaderboards" component={LeaderboardsScreen} />
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
