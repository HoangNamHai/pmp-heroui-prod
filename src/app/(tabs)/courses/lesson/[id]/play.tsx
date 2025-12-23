import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cn } from 'heroui-native';
import { useLayoutEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../../components/app-text';
import {
  HookScreen,
  ChallengeScreen,
  ReasonScreen,
  WrapScreen,
} from '../../../../../components/lesson-screens';
import { useAppTheme } from '../../../../../contexts/app-theme-context';
import { getLessonDetail } from '../../../../../data/lesson-details';
import type { LessonDetail, LessonScreen } from '../../../../../types/lesson';

const StyledFeather = withUniwind(Feather);

// Screen type labels for header
const screenTypeLabels: Record<LessonScreen['type'], string> = {
  hook: 'Introduction',
  challenge: 'Challenge',
  reason: 'Learn',
  feedback: 'Results',
  transfer: 'Apply',
  wrap: 'Summary',
};

export default function LessonPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Record<string, { answer: string; isCorrect: boolean }>
  >({});

  // Hide tab bar
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  const lesson = getLessonDetail(id) as LessonDetail | null;

  if (!lesson) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <AppText className="text-muted">Lesson not found</AppText>
      </View>
    );
  }

  const screens = lesson.screens;
  const currentScreen = screens[currentScreenIndex];
  const isFirstScreen = currentScreenIndex === 0;
  const isLastScreen = currentScreenIndex === screens.length - 1;
  const progress = ((currentScreenIndex + 1) / screens.length) * 100;

  const handleNext = () => {
    if (!isLastScreen) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    } else {
      // Complete lesson and go back
      router.back();
    }
  };

  const handleBack = () => {
    if (!isFirstScreen) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handleAnswer = (questionId: string, answer: string, isCorrect: boolean, points: number) => {
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: { answer, isCorrect },
    }));
    if (isCorrect) {
      setScore((prev) => prev + points);
    }
  };

  // Check if current screen is complete (for enabling Next button)
  const isCurrentScreenComplete = () => {
    if (currentScreen.type === 'challenge') {
      // For challenge screens, check if all questions in all scenarios are answered
      const screen = currentScreen as any;
      const scenarios = screen.scenarios || [];
      const allQuestions = scenarios.flatMap((s: any) => s.questions || []);
      return allQuestions.every((q: any) => answeredQuestions[q.id]);
    }
    // Other screen types are always "complete"
    return true;
  };

  // Get count of answered questions for challenge screens
  const getChallengeProgress = () => {
    if (currentScreen.type !== 'challenge') return null;
    const screen = currentScreen as any;
    const scenarios = screen.scenarios || [];
    const allQuestions = scenarios.flatMap((s: any) => s.questions || []);
    const answered = allQuestions.filter((q: any) => answeredQuestions[q.id]).length;
    return { answered, total: allQuestions.length };
  };

  const challengeProgress = getChallengeProgress();

  const renderScreen = () => {
    switch (currentScreen.type) {
      case 'hook':
        return <HookScreen screen={currentScreen} onContinue={handleNext} />;
      case 'challenge':
        return (
          <ChallengeScreen
            screen={currentScreen}
            onAnswer={handleAnswer}
            answeredQuestions={answeredQuestions}
          />
        );
      case 'reason':
        return <ReasonScreen screen={currentScreen} />;
      case 'wrap':
        return (
          <WrapScreen
            screen={currentScreen}
            totalScore={score}
            maxScore={lesson.totalPoints}
          />
        );
      default:
        // For feedback and transfer screens, show a placeholder for now
        return (
          <View className="flex-1 items-center justify-center px-5">
            <View className="w-20 h-20 rounded-full bg-accent/15 items-center justify-center mb-4">
              <AppText className="text-4xl">🚧</AppText>
            </View>
            <AppText className="text-foreground text-xl font-bold mb-2">
              {screenTypeLabels[currentScreen.type]}
            </AppText>
            <AppText className="text-muted text-center">
              This screen type is coming soon.
            </AppText>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View
        className="bg-background border-b border-divider px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center justify-between mb-3">
          {/* Close Button */}
          <Pressable
            onPress={handleClose}
            className="w-10 h-10 rounded-full bg-default/50 items-center justify-center"
          >
            <StyledFeather name="x" size={20} className="text-foreground" />
          </Pressable>

          {/* Screen Type Label */}
          <View className="flex-row items-center gap-2">
            <AppText className="text-foreground font-semibold">
              {screenTypeLabels[currentScreen.type]}
            </AppText>
            <View className="bg-accent/15 px-2 py-0.5 rounded-full">
              <AppText className="text-accent text-xs font-medium">
                {currentScreenIndex + 1}/{screens.length}
              </AppText>
            </View>
          </View>

          {/* Score */}
          <View className="flex-row items-center gap-1">
            <StyledFeather name="star" size={16} className="text-warning" />
            <AppText className="text-warning font-semibold">{score}</AppText>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-1.5 rounded-full bg-default overflow-hidden">
          <View
            className="h-full rounded-full bg-accent"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      {/* Screen Content */}
      <Animated.View
        key={currentScreenIndex}
        entering={SlideInRight.duration(300)}
        exiting={SlideOutLeft.duration(300)}
        className="flex-1"
      >
        {renderScreen()}
      </Animated.View>

      {/* Footer Navigation */}
      <View
        className="bg-background border-t border-divider px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Challenge Progress Hint */}
        {challengeProgress && !isCurrentScreenComplete() && (
          <View className="mb-3">
            <AppText className="text-muted text-sm text-center">
              Answer all questions to continue ({challengeProgress.answered}/{challengeProgress.total})
            </AppText>
          </View>
        )}

        <View className="flex-row gap-3">
          {/* Back Button */}
          {!isFirstScreen && (
            <Pressable
              onPress={handleBack}
              className="flex-1 bg-default/50 rounded-xl py-4 flex-row items-center justify-center gap-2 active:opacity-80"
            >
              <StyledFeather name="chevron-left" size={18} className="text-foreground" />
              <AppText className="text-foreground font-semibold">Back</AppText>
            </Pressable>
          )}

          {/* Next/Complete Button */}
          <Pressable
            onPress={handleNext}
            disabled={!isCurrentScreenComplete()}
            className={cn(
              'flex-1 rounded-xl py-4 flex-row items-center justify-center gap-2 active:opacity-80',
              isCurrentScreenComplete() ? 'bg-accent' : 'bg-default/30'
            )}
          >
            <AppText
              className={cn(
                'font-semibold',
                isCurrentScreenComplete() ? 'text-white' : 'text-muted'
              )}
            >
              {isLastScreen ? 'Complete' : 'Continue'}
            </AppText>
            {!isLastScreen && (
              <StyledFeather
                name="chevron-right"
                size={18}
                className={isCurrentScreenComplete() ? 'text-white' : 'text-muted'}
              />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
