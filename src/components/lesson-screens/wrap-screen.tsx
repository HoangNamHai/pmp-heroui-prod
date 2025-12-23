import Feather from '@expo/vector-icons/Feather';
import { Card } from 'heroui-native';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../app-text';

const StyledFeather = withUniwind(Feather);

const characterEmojis: Record<string, string> = {
  alex: '👨‍🍳',
  carlos: '👔',
  morgan: '👩‍💼',
  maya: '👩‍🔬',
};

interface WrapScreenProps {
  screen: any;
  totalScore: number;
  maxScore: number;
}

export function WrapScreen({ screen, totalScore, maxScore }: WrapScreenProps) {
  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const passed = scorePercent >= 80;

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 py-6"
      showsVerticalScrollIndicator={false}
    >
      {/* Score Card */}
      <Animated.View
        entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))}
        className="mb-6"
      >
        <Card>
          <Card.Body className="p-6 items-center">
            <View className="w-24 h-24 rounded-full bg-accent/15 items-center justify-center mb-4">
              <AppText className="text-4xl">{passed ? '🎉' : '📚'}</AppText>
            </View>
            <AppText className="text-foreground text-2xl font-bold mb-1">
              {passed ? 'Great Job!' : 'Keep Learning!'}
            </AppText>
            <AppText className="text-muted text-center mb-4">
              {passed
                ? 'You\'ve mastered this lesson!'
                : 'Review the concepts and try again.'}
            </AppText>
            <View className="flex-row items-center gap-4">
              <View className="items-center">
                <AppText className="text-accent text-3xl font-bold">{scorePercent}%</AppText>
                <AppText className="text-muted text-sm">Score</AppText>
              </View>
              <View className="w-px h-12 bg-divider" />
              <View className="items-center">
                <AppText className="text-foreground text-3xl font-bold">{totalScore}</AppText>
                <AppText className="text-muted text-sm">Points</AppText>
              </View>
            </View>
          </Card.Body>
        </Card>
      </Animated.View>

      {/* Summary */}
      {screen.summary && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(100).easing(Easing.out(Easing.ease))}
          className="mb-6"
        >
          <AppText className="text-foreground leading-6 text-center">
            {screen.summary}
          </AppText>
        </Animated.View>
      )}

      {/* Key Takeaways */}
      {screen.takeaways && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(200).easing(Easing.out(Easing.ease))}
          className="mb-6"
        >
          <AppText className="text-foreground font-semibold text-lg mb-4">
            Key Takeaways
          </AppText>
          {screen.takeaways.map((takeaway: string, index: number) => (
            <View key={index} className="flex-row items-start gap-3 mb-3">
              <View className="w-6 h-6 rounded-full bg-success/15 items-center justify-center mt-0.5">
                <StyledFeather name="check" size={14} className="text-success" />
              </View>
              <AppText className="text-foreground flex-1 leading-5">{takeaway}</AppText>
            </View>
          ))}
        </Animated.View>
      )}

      {/* Character Closing */}
      {screen.characterClosing && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(300).easing(Easing.out(Easing.ease))}
          className="mb-6"
        >
          <Card>
            <Card.Body className="p-4">
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 rounded-full bg-accent/15 items-center justify-center">
                  <AppText className="text-2xl">
                    {characterEmojis[screen.characterClosing.character] || '👤'}
                  </AppText>
                </View>
                <View className="flex-1">
                  <AppText className="text-accent text-xs font-semibold uppercase mb-1">
                    {screen.characterClosing.character}
                  </AppText>
                  <AppText className="text-foreground leading-6">
                    "{screen.characterClosing.text}"
                  </AppText>
                </View>
              </View>
            </Card.Body>
          </Card>
        </Animated.View>
      )}

      {/* Next Lesson Preview */}
      {screen.nextLesson && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(400).easing(Easing.out(Easing.ease))}
        >
          <View className="bg-accent/10 rounded-2xl p-4">
            <AppText className="text-accent text-xs font-semibold uppercase mb-2">
              Up Next
            </AppText>
            <AppText className="text-foreground font-semibold text-lg mb-1">
              {screen.nextLesson.title}
            </AppText>
            <AppText className="text-muted leading-5">
              {screen.nextLesson.teaser}
            </AppText>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}
