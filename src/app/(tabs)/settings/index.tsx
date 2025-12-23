import BottomSheet from '@gorhom/bottom-sheet';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Card, cn, FormField } from 'heroui-native';
import { useCallback, useRef, useState } from 'react';
import { Linking, Pressable, View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import {
  DailyGoalSheet,
  ReminderTimeSheet,
  LearningStatsSheet,
} from '../../../components/settings';
import { ThemeSelectorBar } from '../../../components/theme-selector';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { useSettings } from '../../../contexts/settings-context';

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

// Helper to format time
const formatTime = (hour: number, minute: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
};

export default function SettingsScreen() {
  const { isDark } = useAppTheme();
  const { dailyGoal, reminderTime, reminderEnabled, setReminderEnabled } = useSettings();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [haptics, setHaptics] = useState(true);

  // Bottom sheet refs
  const dailyGoalSheetRef = useRef<BottomSheet>(null);
  const reminderTimeSheetRef = useRef<BottomSheet>(null);
  const learningStatsSheetRef = useRef<BottomSheet>(null);

  // Sheet handlers
  const handleOpenDailyGoal = useCallback(() => {
    dailyGoalSheetRef.current?.expand();
  }, []);

  const handleOpenReminderTime = useCallback(() => {
    reminderTimeSheetRef.current?.expand();
  }, []);

  const handleOpenLearningStats = useCallback(() => {
    learningStatsSheetRef.current?.expand();
  }, []);

  const handleCloseDailyGoal = useCallback(() => {
    dailyGoalSheetRef.current?.close();
  }, []);

  const handleCloseReminderTime = useCallback(() => {
    reminderTimeSheetRef.current?.close();
  }, []);

  const handleCloseLearningStats = useCallback(() => {
    learningStatsSheetRef.current?.close();
  }, []);

  const handleOpenHelpCenter = useCallback(async () => {
    const url = 'https://fnbtycoon.com/help';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  }, []);

  const handleContactUs = useCallback(async () => {
    const url = 'https://fnbtycoon.com/contact';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  }, []);

  return (
    <View className="flex-1">
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
        <Pressable onPress={() => router.push('/settings/profile')}>
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
            <FormField isSelected={notifications} onSelectedChange={setNotifications}>
              <FormField.Indicator />
            </FormField>
          }
        />
        <SettingItem
          icon="🔊"
          iconName="volume-2"
          title="Sounds"
          subtitle="Feedback sounds in lessons"
          rightElement={
            <FormField isSelected={sounds} onSelectedChange={setSounds}>
              <FormField.Indicator />
            </FormField>
          }
        />
        <SettingItem
          icon="📳"
          iconName="smartphone"
          title="Haptic Feedback"
          subtitle="Vibration on interactions"
          rightElement={
            <FormField isSelected={haptics} onSelectedChange={setHaptics}>
              <FormField.Indicator />
            </FormField>
          }
        />
      </SettingSection>

      {/* Learning Section */}
      <SettingSection title="Learning" delay={400}>
        <SettingItem
          icon="🎯"
          iconName="target"
          title="Daily Goal"
          subtitle={`${dailyGoal} lesson${dailyGoal > 1 ? 's' : ''} per day`}
          onPress={handleOpenDailyGoal}
        />
        <SettingItem
          icon="⏰"
          iconName="clock"
          title="Reminder Time"
          subtitle={formatTime(reminderTime.hour, reminderTime.minute)}
          onPress={handleOpenReminderTime}
        />
        <SettingItem
          icon="📊"
          iconName="bar-chart-2"
          title="Learning Stats"
          onPress={handleOpenLearningStats}
        />
      </SettingSection>

      {/* Support Section */}
      <SettingSection title="Support" delay={500}>
        <SettingItem
          icon="❓"
          iconName="help-circle"
          title="Help Center"
          onPress={handleOpenHelpCenter}
        />
        <SettingItem
          icon="💬"
          iconName="message-circle"
          title="Contact Us"
          onPress={handleContactUs}
        />
      </SettingSection>

        {/* Version Info */}
        <View className="items-center py-6">
          <AppText className="text-muted text-sm">F&B Tycoon v1.0.0</AppText>
        </View>
      </ScreenScrollView>

      {/* Bottom Sheets */}
      <DailyGoalSheet ref={dailyGoalSheetRef} onClose={handleCloseDailyGoal} />
      <ReminderTimeSheet ref={reminderTimeSheetRef} onClose={handleCloseReminderTime} />
      <LearningStatsSheet ref={learningStatsSheetRef} onClose={handleCloseLearningStats} />
    </View>
  );
}
