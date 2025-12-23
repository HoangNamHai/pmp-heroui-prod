import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { Card, cn } from 'heroui-native';
import { View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { useAppTheme } from '../../../contexts/app-theme-context';

const StyledFeather = withUniwind(Feather);

interface StatCardProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  value: string;
  label: string;
  color?: string;
}

function StatCard({ icon, value, label, color = 'bg-accent/15' }: StatCardProps) {
  return (
    <Card className="flex-1">
      <Card.Body className="items-center py-4">
        <View className={cn('w-10 h-10 rounded-full items-center justify-center mb-2', color)}>
          <StyledFeather name={icon} size={18} className="text-accent" />
        </View>
        <AppText className="text-foreground text-xl font-bold">{value}</AppText>
        <AppText className="text-muted text-xs">{label}</AppText>
      </Card.Body>
    </Card>
  );
}

interface AchievementBadgeProps {
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
}

function AchievementBadge({ emoji, title, description, unlocked }: AchievementBadgeProps) {
  return (
    <View
      className={cn(
        'flex-row items-center gap-3 p-3 rounded-xl',
        unlocked ? 'bg-accent/10' : 'bg-default/50'
      )}
    >
      <View
        className={cn(
          'w-12 h-12 rounded-full items-center justify-center',
          unlocked ? 'bg-accent/20' : 'bg-default'
        )}
      >
        <AppText className={cn('text-2xl', !unlocked && 'opacity-30')}>{emoji}</AppText>
      </View>
      <View className="flex-1">
        <AppText
          className={cn(
            'font-medium',
            unlocked ? 'text-foreground' : 'text-muted'
          )}
        >
          {title}
        </AppText>
        <AppText className="text-muted text-xs">{description}</AppText>
      </View>
      {unlocked && (
        <StyledFeather name="check-circle" size={20} className="text-success" />
      )}
    </View>
  );
}

export default function ProfileScreen() {
  const { isDark } = useAppTheme();

  // Demo data - in production this would come from a user context/store
  const user = {
    name: 'Alex Chen',
    email: 'alex.chen@savoryco.com',
    avatar: '👨‍🍳',
    level: 5,
    xp: 1250,
    xpToNextLevel: 1500,
    streak: 7,
    lessonsCompleted: 16,
    quizzesPassed: 12,
    totalStudyTime: '8h 30m',
    joinDate: 'December 2024',
  };

  const achievements = [
    { emoji: '🔥', title: 'First Steps', description: 'Complete your first lesson', unlocked: true },
    { emoji: '📚', title: 'Bookworm', description: 'Complete 10 lessons', unlocked: true },
    { emoji: '🎯', title: 'Sharpshooter', description: 'Get 100% on 5 quizzes', unlocked: true },
    { emoji: '⚡', title: 'Speed Learner', description: 'Complete 3 lessons in one day', unlocked: true },
    { emoji: '🏆', title: 'Champion', description: 'Complete all Foundation lessons', unlocked: false },
    { emoji: '🌟', title: 'PMP Ready', description: 'Complete all learning paths', unlocked: false },
  ];

  const xpProgress = (user.xp / user.xpToNextLevel) * 100;

  return (
    <ScreenScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Profile Header */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(100).easing(Easing.out(Easing.ease))}
        className="items-center py-6"
      >
        <View className="w-24 h-24 rounded-full bg-accent/20 items-center justify-center mb-4">
          <AppText className="text-5xl">{user.avatar}</AppText>
        </View>
        <AppText className="text-foreground text-2xl font-bold">{user.name}</AppText>
        <AppText className="text-muted">{user.email}</AppText>

        {/* Level Badge */}
        <View className="flex-row items-center gap-2 mt-3">
          <View className="bg-accent/20 px-3 py-1 rounded-full">
            <AppText className="text-accent font-semibold">Level {user.level}</AppText>
          </View>
          <AppText className="text-muted">•</AppText>
          <AppText className="text-muted">{user.xp} XP</AppText>
        </View>

        {/* XP Progress Bar */}
        <View className="w-full mt-4 px-8">
          <View className="flex-row justify-between mb-1">
            <AppText className="text-muted text-xs">Progress to Level {user.level + 1}</AppText>
            <AppText className="text-muted text-xs">{user.xp}/{user.xpToNextLevel} XP</AppText>
          </View>
          <View className="h-2 rounded-full bg-default overflow-hidden">
            <View
              className="h-full rounded-full bg-accent"
              style={{ width: `${xpProgress}%` }}
            />
          </View>
        </View>
      </Animated.View>

      {/* Stats Grid */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(200).easing(Easing.out(Easing.ease))}
        className="mb-6"
      >
        <AppText className="text-muted text-xs uppercase tracking-wider mb-2 px-1">
          Statistics
        </AppText>
        <View className="flex-row gap-3 mb-3">
          <StatCard icon="zap" value={`${user.streak}`} label="Day Streak" />
          <StatCard icon="book-open" value={`${user.lessonsCompleted}`} label="Lessons" />
        </View>
        <View className="flex-row gap-3">
          <StatCard icon="check-circle" value={`${user.quizzesPassed}`} label="Quizzes Passed" />
          <StatCard icon="clock" value={user.totalStudyTime} label="Study Time" />
        </View>
      </Animated.View>

      {/* Achievements */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(300).easing(Easing.out(Easing.ease))}
        className="mb-6"
      >
        <AppText className="text-muted text-xs uppercase tracking-wider mb-2 px-1">
          Achievements
        </AppText>
        <Card>
          <Card.Body className="p-3 gap-2">
            {achievements.map((achievement, index) => (
              <AchievementBadge
                key={index}
                emoji={achievement.emoji}
                title={achievement.title}
                description={achievement.description}
                unlocked={achievement.unlocked}
              />
            ))}
          </Card.Body>
        </Card>
      </Animated.View>

      {/* Account Info */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(400).easing(Easing.out(Easing.ease))}
        className="mb-6"
      >
        <AppText className="text-muted text-xs uppercase tracking-wider mb-2 px-1">
          Account
        </AppText>
        <Card>
          <Card.Body className="p-4">
            <View className="flex-row justify-between py-2">
              <AppText className="text-muted">Member since</AppText>
              <AppText className="text-foreground font-medium">{user.joinDate}</AppText>
            </View>
            <View className="flex-row justify-between py-2 border-t border-divider">
              <AppText className="text-muted">Account type</AppText>
              <AppText className="text-foreground font-medium">Premium</AppText>
            </View>
          </Card.Body>
        </Card>
      </Animated.View>
    </ScreenScrollView>
  );
}
