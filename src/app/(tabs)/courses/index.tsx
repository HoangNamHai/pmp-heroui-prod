import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { Card, cn, useThemeColor } from 'heroui-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { getLearningPaths, getLessonsForPath, getOverallStats } from '../../../services/lesson-data';
import type { LearningPathWithProgress, LessonWithProgress } from '../../../types/lesson';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledFeather = withUniwind(Feather);

function LessonItem({ lesson, index }: { lesson: LessonWithProgress; index: number }) {
  return (
    <Pressable
      disabled={lesson.isLocked}
      className={cn(
        'flex-row items-center gap-3 py-3',
        index > 0 && 'border-t border-divider'
      )}
    >
      {/* Status Icon */}
      <View
        className={cn(
          'w-8 h-8 rounded-full items-center justify-center',
          lesson.isCompleted && 'bg-success',
          lesson.isInProgress && 'bg-accent',
          lesson.isLocked && 'bg-default',
          !lesson.isCompleted && !lesson.isInProgress && !lesson.isLocked && 'bg-default'
        )}
      >
        {lesson.isCompleted ? (
          <StyledFeather name="check" size={16} className="text-white" />
        ) : lesson.isLocked ? (
          <StyledFeather name="lock" size={14} className="text-muted" />
        ) : lesson.isInProgress ? (
          <StyledFeather name="play" size={14} className="text-white" />
        ) : (
          <AppText className="text-muted text-xs font-medium">{index + 1}</AppText>
        )}
      </View>

      {/* Lesson Info */}
      <View className={cn('flex-1', lesson.isLocked && 'opacity-50')}>
        <AppText
          className={cn(
            'font-medium',
            lesson.isCompleted ? 'text-success' : 'text-foreground'
          )}
        >
          {lesson.title}
        </AppText>
        <View className="flex-row items-center gap-2 mt-0.5">
          <View className="flex-row items-center gap-1">
            <StyledFeather name="clock" size={12} className="text-muted" />
            <AppText className="text-muted text-xs">{lesson.duration} min</AppText>
          </View>
          <View className="flex-row items-center gap-1">
            <AppText className="text-warning text-xs">+{lesson.xpReward} XP</AppText>
          </View>
        </View>
      </View>

      {/* Progress or Arrow */}
      {lesson.isInProgress ? (
        <View className="items-end">
          <AppText className="text-accent text-xs font-medium">
            {lesson.progressPercent}%
          </AppText>
        </View>
      ) : !lesson.isLocked && !lesson.isCompleted ? (
        <StyledFeather name="chevron-right" size={18} className="text-muted" />
      ) : null}
    </Pressable>
  );
}

interface PathCardProps {
  path: LearningPathWithProgress;
  index: number;
  onPress: () => void;
}

function PathCard({ path, index, onPress }: PathCardProps) {
  const isCompleted = path.progress === 100;
  const isLocked = path.progress === 0 && index > 0;

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(300)
        .delay(index * 100)
        .easing(Easing.out(Easing.ease))}
      disabled={isLocked}
      onPress={onPress}
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
  const insets = useSafeAreaInsets();
  const learningPaths = getLearningPaths();
  const stats = getOverallStats();
  const [selectedPath, setSelectedPath] = useState<LearningPathWithProgress | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const backgroundColor = useThemeColor('background');
  const handleIndicatorColor = useThemeColor('muted');

  // Account for header bar (~44) + safe area top
  const topInset = insets.top + 44;
  const snapPoints = useMemo(() => ['85%'], []);
  const lessons = selectedPath ? getLessonsForPath(selectedPath.id) : [];

  const handlePathPress = useCallback((path: LearningPathWithProgress) => {
    console.log('Path pressed:', path.title);
    setSelectedPath(path);
    bottomSheetRef.current?.expand();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('Bottom sheet index changed:', index);
    if (index === -1) {
      setSelectedPath(null);
    }
  }, []);

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

  return (
    <View className="flex-1">
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
          <PathCard
            key={path.id}
            path={path}
            index={index}
            onPress={() => handlePathPress(path)}
          />
        ))}
      </ScreenScrollView>

      {/* Lessons Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        topInset={topInset}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: handleIndicatorColor }}
      >
        {selectedPath && (
          <View className="flex-1 px-4 pt-2 pb-6">
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className={cn(
                  'w-12 h-12 rounded-xl items-center justify-center',
                  selectedPath.color
                )}
              >
                <AppText className="text-2xl">{selectedPath.icon}</AppText>
              </View>
              <View className="flex-1">
                <AppText className="text-foreground text-lg font-semibold">
                  {selectedPath.title}
                </AppText>
                <AppText className="text-muted text-sm">
                  {selectedPath.completedLessons} of {selectedPath.totalLessons} completed
                </AppText>
              </View>
            </View>

            {/* Lessons List */}
            <BottomSheetScrollView showsVerticalScrollIndicator={false}>
              {lessons.map((lesson, index) => (
                <LessonItem key={lesson.id} lesson={lesson} index={index} />
              ))}
            </BottomSheetScrollView>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}
