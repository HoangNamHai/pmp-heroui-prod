import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import type { ComponentProps } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../contexts/app-theme-context';

type TabIconName = ComponentProps<typeof Feather>['name'];

interface TabBarIconProps {
  name: TabIconName;
  color: string;
  focused: boolean;
  focusedBackgroundColor: string;
}

function TabBarIcon({ name, color, focused, focusedBackgroundColor }: TabBarIconProps) {
  return (
    <View style={[styles.iconContainer, focused && { backgroundColor: focusedBackgroundColor }]}>
      <Feather name={name} size={22} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const { isDark, currentTheme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor('background');
  const foregroundColor = useThemeColor('foreground');
  const accentColor = useThemeColor('accent');
  const mutedColor = useThemeColor('muted');
  const borderColor = useThemeColor('border');

  // Dynamic focused icon background - slightly transparent accent color
  const focusedBgColor = isDark ? 'rgba(217, 150, 80, 0.15)' : 'rgba(217, 138, 60, 0.12)';

  return (
    <View style={styles.container} className="bg-background">
      <Tabs
        key={currentTheme}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: accentColor,
          tabBarInactiveTintColor: mutedColor,
          tabBarStyle: {
            backgroundColor: backgroundColor,
            borderTopColor: borderColor,
            borderTopWidth: StyleSheet.hairlineWidth,
            height: Platform.select({
              ios: 85 + insets.bottom / 2,
              android: 65,
            }),
            paddingTop: 8,
            paddingBottom: Platform.select({
              ios: insets.bottom / 2 + 8,
              android: 10,
            }),
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter_500Medium',
            fontSize: 11,
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="home" color={color} focused={focused} focusedBackgroundColor={focusedBgColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            title: 'Courses',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="book-open" color={color} focused={focused} focusedBackgroundColor={focusedBgColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="practices"
          options={{
            title: 'Practices',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="edit-3" color={color} focused={focused} focusedBackgroundColor={focusedBgColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name="settings" color={color} focused={focused} focusedBackgroundColor={focusedBgColor} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 28,
    borderRadius: 14,
  },
});
