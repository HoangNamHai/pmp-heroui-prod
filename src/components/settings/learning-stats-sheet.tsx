import Feather from '@expo/vector-icons/Feather';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Card, useThemeColor } from 'heroui-native';
import { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../app-text';
import { useSettings } from '../../contexts/settings-context';

const StyledFeather = withUniwind(Feather);

interface StatItemProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string | number;
  color: string;
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  return (
    <View className="flex-row items-center gap-3 py-3">
      <View className={`w-10 h-10 rounded-xl items-center justify-center bg-${color}/15`}>
        <StyledFeather name={icon} size={20} className={`text-${color}`} />
      </View>
      <View className="flex-1">
        <AppText className="text-muted text-sm">{label}</AppText>
        <AppText className="text-foreground font-semibold text-lg">{value}</AppText>
      </View>
    </View>
  );
}

interface LearningStatsSheetProps {
  onClose?: () => void;
}

export const LearningStatsSheet = forwardRef<BottomSheet, LearningStatsSheetProps>(
  ({ onClose }, ref) => {
    const insets = useSafeAreaInsets();
    const { learningStats } = useSettings();

    const backgroundColor = useThemeColor('background');
    const handleIndicatorColor = useThemeColor('muted');

    const snapPoints = useMemo(() => ['75%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours === 0) return `${mins}m`;
      if (mins === 0) return `${hours}h`;
      return `${hours}h ${mins}m`;
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: handleIndicatorColor }}
        onClose={onClose}
      >
        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-6">
            <View className="w-14 h-14 rounded-full bg-accent/15 items-center justify-center mb-3">
              <StyledFeather name="bar-chart-2" size={28} className="text-accent" />
            </View>
            <AppText className="text-foreground text-xl font-bold">
              Learning Stats
            </AppText>
            <AppText className="text-muted text-center mt-1">
              Your progress at a glance
            </AppText>
          </View>

          {/* Main Stats Grid */}
          <View className="flex-row gap-3 mb-4">
            {/* Streak Card */}
            <Card className="flex-1">
              <Card.Body className="items-center py-4">
                <AppText className="text-4xl mb-1">🔥</AppText>
                <AppText className="text-accent text-3xl font-bold">
                  {learningStats.currentStreak}
                </AppText>
                <AppText className="text-muted text-sm">Day Streak</AppText>
              </Card.Body>
            </Card>

            {/* XP Card */}
            <Card className="flex-1">
              <Card.Body className="items-center py-4">
                <AppText className="text-4xl mb-1">⭐</AppText>
                <AppText className="text-warning text-3xl font-bold">
                  {learningStats.totalXpEarned.toLocaleString()}
                </AppText>
                <AppText className="text-muted text-sm">Total XP</AppText>
              </Card.Body>
            </Card>
          </View>

          {/* Weekly Progress */}
          <Card className="mb-4">
            <Card.Body className="p-4">
              <View className="flex-row items-center justify-between mb-3">
                <AppText className="text-foreground font-semibold">This Week</AppText>
                <AppText className="text-accent font-medium">
                  {learningStats.lessonsThisWeek} lessons
                </AppText>
              </View>
              {/* Progress Bar */}
              <View className="h-3 rounded-full bg-default overflow-hidden">
                <View
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.min((learningStats.lessonsThisWeek / 35) * 100, 100)}%` }}
                />
              </View>
              <AppText className="text-muted text-xs mt-2">
                Weekly goal: 35 lessons (5 per day)
              </AppText>
            </Card.Body>
          </Card>

          {/* Detailed Stats */}
          <Card>
            <Card.Body className="p-4">
              <AppText className="text-foreground font-semibold mb-2">
                All Time Stats
              </AppText>

              <StatItem
                icon="book-open"
                label="Lessons Completed"
                value={learningStats.totalLessonsCompleted}
                color="accent"
              />

              <View className="h-px bg-divider" />

              <StatItem
                icon="award"
                label="Perfect Lessons"
                value={learningStats.perfectLessons}
                color="success"
              />

              <View className="h-px bg-divider" />

              <StatItem
                icon="percent"
                label="Average Score"
                value={`${learningStats.averageScore}%`}
                color="warning"
              />

              <View className="h-px bg-divider" />

              <StatItem
                icon="clock"
                label="Time Spent Learning"
                value={formatTime(learningStats.totalTimeSpent)}
                color="accent"
              />

              <View className="h-px bg-divider" />

              <StatItem
                icon="trending-up"
                label="Longest Streak"
                value={`${learningStats.longestStreak} days`}
                color="success"
              />
            </Card.Body>
          </Card>

          {/* Motivational Message */}
          <View className="mt-4 p-4 bg-accent/10 rounded-2xl">
            <AppText className="text-accent text-center font-medium">
              {learningStats.currentStreak >= 7
                ? "🎉 Amazing! You're on fire! Keep the streak going!"
                : learningStats.currentStreak >= 3
                  ? "💪 Great progress! You're building a solid habit!"
                  : "🌱 Every lesson counts. Start building your streak today!"}
            </AppText>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

LearningStatsSheet.displayName = 'LearningStatsSheet';
