import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Card, cn } from 'heroui-native';
import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { getLessonDetail } from '../../../../data/lesson-details';
import type { LessonDetail, LessonScreen } from '../../../../types/lesson';

const StyledFeather = withUniwind(Feather);

// Character emoji mapping
const characterEmojis: Record<string, string> = {
  alex: '👨‍🍳',
  carlos: '👔',
  morgan: '👩‍💼',
  maya: '👩‍🔬',
};

// Screen type labels
const screenTypeLabels: Record<LessonScreen['type'], string> = {
  hook: 'Introduction',
  challenge: 'Challenge',
  reason: 'Learn',
  feedback: 'Results',
  transfer: 'Apply',
  wrap: 'Summary',
};

function ObjectiveItem({ text, index }: { text: string; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(300 + index * 50).easing(Easing.out(Easing.ease))}
      className="flex-row items-start gap-3 mb-2"
    >
      <View className="w-5 h-5 rounded-full bg-success/20 items-center justify-center mt-0.5">
        <StyledFeather name="check" size={12} className="text-success" />
      </View>
      <AppText className="text-foreground flex-1 leading-5">{text}</AppText>
    </Animated.View>
  );
}

function ScreenOverviewItem({ screen, index }: { screen: LessonScreen; index: number }) {
  const iconMap: Record<LessonScreen['type'], React.ComponentProps<typeof Feather>['name']> = {
    hook: 'zap',
    challenge: 'target',
    reason: 'book-open',
    feedback: 'bar-chart-2',
    transfer: 'refresh-cw',
    wrap: 'award',
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(500 + index * 50).easing(Easing.out(Easing.ease))}
      className={cn(
        'flex-row items-center gap-3 py-3',
        index > 0 && 'border-t border-divider'
      )}
    >
      <View className="w-10 h-10 rounded-xl bg-accent/15 items-center justify-center">
        <StyledFeather name={iconMap[screen.type]} size={18} className="text-accent" />
      </View>
      <View className="flex-1">
        <AppText className="text-foreground font-medium">
          {screenTypeLabels[screen.type]}
        </AppText>
        {screen.title && (
          <AppText className="text-muted text-sm" numberOfLines={1}>
            {screen.title}
          </AppText>
        )}
      </View>
      <View className="flex-row items-center gap-1">
        <StyledFeather name="clock" size={12} className="text-muted" />
        <AppText className="text-muted text-xs">{Math.ceil(screen.duration / 60)}m</AppText>
      </View>
    </Animated.View>
  );
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  // Hide tab bar when this screen is focused
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

  // Get hook screen for scenario intro
  const hookScreen = lesson.screens.find((s) => s.type === 'hook') as any;

  return (
    <View className="flex-1 bg-background">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View
          entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))}
          className="px-5 pt-4"
        >
          <View className="items-center mb-4">
            {/* Lesson Icon */}
            <View className="w-20 h-20 rounded-3xl bg-accent/15 items-center justify-center mb-4">
              <AppText className="text-4xl">📋</AppText>
            </View>

            {/* Domain Badge */}
            <View className="bg-accent/15 px-3 py-1 rounded-full mb-3">
              <AppText className="text-accent text-xs font-medium">
                {lesson.domain}
              </AppText>
            </View>

            {/* Title */}
            <AppText className="text-foreground text-xl font-bold text-center mb-2">
              {lesson.title}
            </AppText>

            {/* Description */}
            <AppText className="text-muted text-center leading-5 mb-4">
              {lesson.description}
            </AppText>

            {/* Meta Badges */}
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1.5 bg-default/50 px-3 py-1.5 rounded-full">
                <StyledFeather name="clock" size={14} className="text-muted" />
                <AppText className="text-foreground text-sm font-medium">
                  {lesson.duration} min
                </AppText>
              </View>
              <View className="flex-row items-center gap-1.5 bg-warning/15 px-3 py-1.5 rounded-full">
                <StyledFeather name="star" size={14} className="text-warning" />
                <AppText className="text-warning text-sm font-medium">
                  +{lesson.xpReward} XP
                </AppText>
              </View>
              <View className="flex-row items-center gap-1.5 bg-success/15 px-3 py-1.5 rounded-full">
                <StyledFeather name="award" size={14} className="text-success" />
                <AppText className="text-success text-sm font-medium">
                  {lesson.totalPoints} pts
                </AppText>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Characters */}
        {lesson.characters.length > 0 && (
          <Animated.View
            entering={FadeInDown.duration(300).delay(150).easing(Easing.out(Easing.ease))}
            className="px-5 mb-4"
          >
            <View className="flex-row items-center justify-center gap-2">
              <AppText className="text-muted text-sm">Featuring:</AppText>
              <View className="flex-row items-center gap-1">
                {lesson.characters.map((char) => (
                  <View key={char} className="w-8 h-8 rounded-full bg-accent/10 items-center justify-center">
                    <AppText className="text-lg">{characterEmojis[char] || '👤'}</AppText>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Learning Objectives */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(200).easing(Easing.out(Easing.ease))}
          className="px-5 mb-4"
        >
          <Card>
            <Card.Body className="p-4">
              <View className="flex-row items-center gap-2 mb-3">
                <StyledFeather name="target" size={18} className="text-accent" />
                <AppText className="text-foreground font-semibold">
                  Learning Objectives
                </AppText>
              </View>
              {lesson.objectives.map((objective, index) => (
                <ObjectiveItem key={index} text={objective} index={index} />
              ))}
            </Card.Body>
          </Card>
        </Animated.View>

        {/* Scenario Introduction */}
        {hookScreen && (
          <Animated.View
            entering={FadeInDown.duration(300).delay(400).easing(Easing.out(Easing.ease))}
            className="px-5 mb-4"
          >
            <Card>
              <Card.Body className="p-4">
                <View className="flex-row items-center gap-2 mb-3">
                  <StyledFeather name="play-circle" size={18} className="text-accent" />
                  <AppText className="text-foreground font-semibold">
                    The Scenario
                  </AppText>
                </View>
                {hookScreen.headline && (
                  <AppText className="text-foreground font-medium mb-2">
                    {hookScreen.headline}
                  </AppText>
                )}
                {hookScreen.dialogue && (
                  <View className="bg-default/30 rounded-xl p-3 mt-2">
                    <View className="flex-row items-start gap-3">
                      <View className="w-10 h-10 rounded-full bg-accent/15 items-center justify-center">
                        <AppText className="text-xl">
                          {characterEmojis[hookScreen.dialogue.character] || '👤'}
                        </AppText>
                      </View>
                      <View className="flex-1">
                        <AppText className="text-accent text-xs font-medium uppercase mb-1">
                          {hookScreen.dialogue.character}
                        </AppText>
                        <AppText className="text-foreground leading-5">
                          "{hookScreen.dialogue.text}"
                        </AppText>
                      </View>
                    </View>
                  </View>
                )}
                {hookScreen.learningHook && (
                  <View className="bg-accent/10 rounded-xl p-3 mt-3">
                    <AppText className="text-accent text-sm font-medium leading-5">
                      💡 {hookScreen.learningHook}
                    </AppText>
                  </View>
                )}
              </Card.Body>
            </Card>
          </Animated.View>
        )}

        {/* Lesson Structure Overview */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(450).easing(Easing.out(Easing.ease))}
          className="px-5 mb-4"
        >
          <Card>
            <Card.Body className="p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <StyledFeather name="list" size={18} className="text-accent" />
                <AppText className="text-foreground font-semibold">
                  Lesson Structure
                </AppText>
              </View>
              <AppText className="text-muted text-sm mb-3">
                {lesson.screens.length} sections to complete
              </AppText>
              {lesson.screens.map((screen, index) => (
                <ScreenOverviewItem key={screen.id} screen={screen} index={index} />
              ))}
            </Card.Body>
          </Card>
        </Animated.View>

        {/* Mastery Info */}
        <Animated.View
          entering={FadeInDown.duration(300).delay(600).easing(Easing.out(Easing.ease))}
          className="px-5"
        >
          <View className="bg-success/10 rounded-2xl p-4">
            <View className="flex-row items-center gap-2 mb-2">
              <StyledFeather name="award" size={18} className="text-success" />
              <AppText className="text-success font-semibold">Mastery Requirement</AppText>
            </View>
            <AppText className="text-foreground text-sm leading-5">
              Score {lesson.masteryThreshold}% or higher to complete this lesson.
              {lesson.retryAllowed && ' You can retry if needed.'}
            </AppText>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Sticky Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-background border-t border-divider px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={() => {
            router.push(`/courses/lesson/${id}/play`);
          }}
          className="bg-accent rounded-xl py-4 flex-row items-center justify-center gap-2 active:opacity-80"
        >
          <StyledFeather name="play" size={18} className="text-white" />
          <AppText className="text-white font-semibold text-base">Start Lesson</AppText>
        </Pressable>
      </View>
    </View>
  );
}
