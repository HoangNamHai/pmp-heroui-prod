import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { Card, Switch } from 'heroui-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { ThemeSelectorBar } from '../../../components/theme-selector';
import { useAppTheme } from '../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

interface SettingItemProps {
  icon: string;
  iconName: React.ComponentProps<typeof Feather>['name'];
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingItem({ icon, iconName, title, subtitle, onPress, rightElement }: SettingItemProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress && !rightElement}>
      <View className="flex-row items-center py-4 px-4 gap-4">
        <View className="w-10 h-10 rounded-xl bg-accent/15 items-center justify-center">
          <StyledFeather name={iconName} size={20} className="text-accent" />
        </View>
        <View className="flex-1">
          <AppText className="text-foreground font-medium">{title}</AppText>
          {subtitle && (
            <AppText className="text-muted text-sm">{subtitle}</AppText>
          )}
        </View>
        {rightElement || (
          <StyledFeather name="chevron-right" size={20} className="text-muted" />
        )}
      </View>
    </Pressable>
  );
}

function SettingSection({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(delay).easing(Easing.out(Easing.ease))}
      className="mb-6"
    >
      <AppText className="text-muted text-xs uppercase tracking-wider mb-2 px-4">
        {title}
      </AppText>
      <Card>
        <Card.Body className="p-0 divide-y divide-divider">
          {children}
        </Card.Body>
      </Card>
    </Animated.View>
  );
}

export default function SettingsScreen() {
  const { isDark } = useAppTheme();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [haptics, setHaptics] = useState(true);

  return (
    <ScreenScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View className="pt-4 pb-6">
        <AppText className="text-foreground text-2xl font-bold">
          Settings
        </AppText>
        <AppText className="text-muted text-sm mt-1">
          Customize your learning experience
        </AppText>
      </View>

      {/* Profile Section */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(100).easing(Easing.out(Easing.ease))}
        className="mb-6"
      >
        <Pressable>
          <Card>
            <Card.Body className="flex-row items-center gap-4 py-4">
              <View className="w-16 h-16 rounded-full bg-accent/20 items-center justify-center">
                <AppText className="text-3xl">👨‍🍳</AppText>
              </View>
              <View className="flex-1">
                <AppText className="text-foreground font-semibold text-lg">
                  Alex Chen
                </AppText>
                <AppText className="text-muted text-sm">
                  alex.chen@savoryco.com
                </AppText>
                <View className="flex-row items-center gap-2 mt-1">
                  <View className="bg-accent/20 px-2 py-0.5 rounded-full">
                    <AppText className="text-accent text-xs font-medium">Level 5</AppText>
                  </View>
                  <AppText className="text-muted text-xs">• 1,250 XP</AppText>
                </View>
              </View>
              <StyledFeather name="chevron-right" size={20} className="text-muted" />
            </Card.Body>
          </Card>
        </Pressable>
      </Animated.View>

      {/* Theme Section */}
      <SettingSection title="Appearance" delay={200}>
        <View className="py-4 px-4">
          <AppText className="text-foreground font-medium mb-3">Theme</AppText>
          <ThemeSelectorBar />
        </View>
      </SettingSection>

      {/* Notifications Section */}
      <SettingSection title="Notifications" delay={300}>
        <SettingItem
          icon="🔔"
          iconName="bell"
          title="Push Notifications"
          subtitle="Daily reminders and updates"
          rightElement={
            <Switch
              isSelected={notifications}
              onValueChange={setNotifications}
            />
          }
        />
        <SettingItem
          icon="🔊"
          iconName="volume-2"
          title="Sounds"
          subtitle="Feedback sounds in lessons"
          rightElement={
            <Switch isSelected={sounds} onValueChange={setSounds} />
          }
        />
        <SettingItem
          icon="📳"
          iconName="smartphone"
          title="Haptic Feedback"
          subtitle="Vibration on interactions"
          rightElement={
            <Switch isSelected={haptics} onValueChange={setHaptics} />
          }
        />
      </SettingSection>

      {/* Learning Section */}
      <SettingSection title="Learning" delay={400}>
        <SettingItem
          icon="🎯"
          iconName="target"
          title="Daily Goal"
          subtitle="5 lessons per day"
          onPress={() => {}}
        />
        <SettingItem
          icon="⏰"
          iconName="clock"
          title="Reminder Time"
          subtitle="9:00 AM"
          onPress={() => {}}
        />
        <SettingItem
          icon="📊"
          iconName="bar-chart-2"
          title="Learning Stats"
          onPress={() => {}}
        />
      </SettingSection>

      {/* Support Section */}
      <SettingSection title="Support" delay={500}>
        <SettingItem
          icon="❓"
          iconName="help-circle"
          title="Help Center"
          onPress={() => {}}
        />
        <SettingItem
          icon="💬"
          iconName="message-circle"
          title="Contact Us"
          onPress={() => {}}
        />
        <SettingItem
          icon="⭐"
          iconName="star"
          title="Rate the App"
          onPress={() => {}}
        />
      </SettingSection>

      {/* Version Info */}
      <View className="items-center py-6">
        <AppText className="text-muted text-sm">F&B Tycoon v1.0.0</AppText>
        <AppText className="text-muted text-xs mt-1">
          Built with HeroUI Native
        </AppText>
      </View>
    </ScreenScrollView>
  );
}
