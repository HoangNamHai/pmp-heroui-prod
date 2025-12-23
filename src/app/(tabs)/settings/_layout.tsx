import { Stack } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { Platform, View } from 'react-native';
import { ThemeToggle } from '../../../components/theme-toggle';
import { useAppTheme } from '../../../contexts/app-theme-context';

export default function SettingsLayout() {
  const { isDark } = useAppTheme();
  const foregroundColor = useThemeColor('foreground');
  const backgroundColor = useThemeColor('background');

  return (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerBlurEffect: isDark ? 'dark' : 'light',
          headerTintColor: foregroundColor,
          headerStyle: {
            backgroundColor: Platform.select({
              ios: undefined,
              android: backgroundColor,
            }),
          },
          headerTitleStyle: {
            fontFamily: 'Inter_600SemiBold',
          },
          headerRight: () => <ThemeToggle />,
          contentStyle: {
            backgroundColor: backgroundColor,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: 'Settings',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerTitle: 'Profile',
          }}
        />
      </Stack>
    </View>
  );
}
