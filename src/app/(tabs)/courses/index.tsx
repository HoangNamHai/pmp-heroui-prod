import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { Card, cn } from 'heroui-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { getLearningPaths, getOverallStats } from '../../../services/lesson-data';
import type { LearningPathWithProgress } from '../../../types/lesson';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledFeather = withUniwind(Feather);

function PathCard({ path, index }: { path: LearningPathWithProgress; index: number }) {
  const isCompleted = path.progress === 100;
  const isLocked = path.progress === 0 && index > 0;

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(300)
        .delay(index * 100)
        .easing(Easing.out(Easing.ease))}
      disabled={isLocked}
    >
      <Card className={cn('mb-3', isLocked && 'opacity-50')}>
        <Card.Body className="flex-row items-center gap-4 py-4">
          <View
            className={cn(
              'w-14 h-14 rounded-2xl items-center justify-center',
              path.color
            )}
          >
            <AppText className="text-2xl">{path.icon}</AppText>
          </View>

          <View className="flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <AppText className="text-foreground font-semibold text-base">
                {path.title}
              </AppText>
              {isCompleted && (
                <View className="w-5 h-5 rounded-full bg-success items-center justify-center">
                  <StyledFeather name="check" size={12} className="text-white" />
                </View>
              )}
              {isLocked && (
                <StyledFeather name="lock" size={14} className="text-muted" />
              )}
            </View>
            <AppText className="text-muted text-sm">{path.subtitle}</AppText>

            {/* Progress Bar */}
            <View className="gap-1 mt-1">
              <View className="h-1.5 rounded-full bg-default overflow-hidden">
                <View
                  className={cn(
                    'h-full rounded-full',
                    isCompleted ? 'bg-success' : 'bg-accent'
                  )}
                  style={{ width: `${path.progress}%` }}
                />
              </View>
              <AppText className="text-muted text-xs">
                {path.completedLessons} of {path.totalLessons} lessons
              </AppText>
            </View>
          </View>

          <StyledFeather
            name="chevron-right"
            size={20}
            className={isLocked ? 'text-muted' : 'text-foreground'}
          />
        </Card.Body>
      </Card>
    </AnimatedPressable>
  );
}

export default function CoursesScreen() {
  const { isDark } = useAppTheme();
  const learningPaths = getLearningPaths();
  const stats = getOverallStats();

  return (
    <ScreenScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View className="pt-4 pb-6">
        <AppText className="text-foreground text-2xl font-bold">
          Learning Paths
        </AppText>
        <AppText className="text-muted text-sm mt-1">
          Master PMP concepts through interactive scenarios
        </AppText>
      </View>

      {/* Stats Row */}
      <View className="flex-row gap-3 mb-6">
        <Card className="flex-1">
          <Card.Body className="items-center py-3">
            <AppText className="text-accent text-2xl font-bold">
              {stats.completedLessons}
            </AppText>
            <AppText className="text-muted text-xs">Completed</AppText>
          </Card.Body>
        </Card>
        <Card className="flex-1">
          <Card.Body className="items-center py-3">
            <AppText className="text-foreground text-2xl font-bold">
              {stats.totalLessons}
            </AppText>
            <AppText className="text-muted text-xs">Total Lessons</AppText>
          </Card.Body>
        </Card>
        <Card className="flex-1">
          <Card.Body className="items-center py-3">
            <AppText className="text-success text-2xl font-bold">
              {stats.progress}%
            </AppText>
            <AppText className="text-muted text-xs">Progress</AppText>
          </Card.Body>
        </Card>
      </View>

      {/* Learning Paths */}
      <AppText className="text-foreground font-semibold text-lg mb-3">
        All Paths
      </AppText>

      {learningPaths.map((path, index) => (
        <PathCard key={path.id} path={path} index={index} />
      ))}
    </ScreenScrollView>
  );
}
