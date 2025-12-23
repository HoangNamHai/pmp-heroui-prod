import Feather from '@expo/vector-icons/Feather';
import { Card, cn } from 'heroui-native';
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

interface AnsweredQuestion {
  answer: string;
  isCorrect: boolean;
}

interface FeedbackScreenProps {
  screen: any;
  answeredQuestions: Record<string, AnsweredQuestion>;
  totalScore: number;
  maxScore: number;
}

export function FeedbackScreen({
  screen,
  answeredQuestions,
  totalScore,
  maxScore,
}: FeedbackScreenProps) {
  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const masteryThreshold = screen.masteryThreshold || 60;
  const passed = scorePercent >= masteryThreshold;

  // Get performance summary
  const totalQuestions = Object.keys(answeredQuestions).length;
  const correctAnswers = Object.values(answeredQuestions).filter((q) => q.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  // Get character reactions based on answered questions
  const getReactions = () => {
    const reactions: Array<{ character: string; text: string; isCorrect: boolean }> = [];
    const characterReactions = screen.characterReactions || {};

    Object.entries(characterReactions).forEach(([scenarioId, reactionData]: [string, any]) => {
      // Check if any question from this scenario was answered
      const scenarioAnswers = Object.entries(answeredQuestions).filter(([qId]) =>
        qId.includes(scenarioId.charAt(0)) || qId.startsWith('q')
      );

      if (scenarioAnswers.length > 0) {
        // Check if all answers for this scenario were correct
        const allCorrect = scenarioAnswers.every(([_, a]) => a.isCorrect);

        if (allCorrect && reactionData.correct) {
          reactions.push({
            character: reactionData.correct.character,
            text: reactionData.correct.text,
            isCorrect: true,
          });
        } else if (!allCorrect && reactionData.incorrect) {
          reactions.push({
            character: reactionData.incorrect.character,
            text: reactionData.incorrect.text,
            isCorrect: false,
          });
        }
      }
    });

    return reactions.slice(0, 3); // Limit to 3 reactions
  };

  const reactions = getReactions();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 py-6"
      showsVerticalScrollIndicator={false}
    >
      {/* Results Header */}
      <Animated.View
        entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))}
        className="items-center mb-6"
      >
        <View
          className={cn(
            'w-24 h-24 rounded-full items-center justify-center mb-4',
            passed ? 'bg-success/15' : 'bg-warning/15'
          )}
        >
          <AppText className="text-5xl">{passed ? '🎉' : '📝'}</AppText>
        </View>
        <AppText className="text-foreground text-2xl font-bold mb-1">
          {passed ? 'Great Progress!' : 'Keep Learning!'}
        </AppText>
        <AppText className="text-muted text-center">
          {passed
            ? 'You\'ve demonstrated a solid understanding of this topic.'
            : 'Review the concepts and continue to improve.'}
        </AppText>
      </Animated.View>

      {/* Score Card */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(100).easing(Easing.out(Easing.ease))}
        className="mb-6"
      >
        <Card>
          <Card.Body className="p-5">
            {/* Score Percentage */}
            <View className="items-center mb-4">
              <AppText
                className={cn(
                  'text-5xl font-bold',
                  passed ? 'text-success' : 'text-warning'
                )}
              >
                {scorePercent}%
              </AppText>
              <AppText className="text-muted text-sm">Overall Score</AppText>
            </View>

            {/* Progress Bar */}
            <View className="h-3 rounded-full bg-default overflow-hidden mb-4">
              <View
                className={cn(
                  'h-full rounded-full',
                  passed ? 'bg-success' : 'bg-warning'
                )}
                style={{ width: `${scorePercent}%` }}
              />
            </View>

            {/* Stats Row */}
            <View className="flex-row justify-around">
              <View className="items-center">
                <View className="flex-row items-center gap-1 mb-1">
                  <StyledFeather name="check-circle" size={18} className="text-success" />
                  <AppText className="text-success text-xl font-bold">{correctAnswers}</AppText>
                </View>
                <AppText className="text-muted text-xs">Correct</AppText>
              </View>

              <View className="w-px bg-divider" />

              <View className="items-center">
                <View className="flex-row items-center gap-1 mb-1">
                  <StyledFeather name="x-circle" size={18} className="text-danger" />
                  <AppText className="text-danger text-xl font-bold">{incorrectAnswers}</AppText>
                </View>
                <AppText className="text-muted text-xs">Incorrect</AppText>
              </View>

              <View className="w-px bg-divider" />

              <View className="items-center">
                <View className="flex-row items-center gap-1 mb-1">
                  <StyledFeather name="star" size={18} className="text-warning" />
                  <AppText className="text-warning text-xl font-bold">{totalScore}</AppText>
                </View>
                <AppText className="text-muted text-xs">Points</AppText>
              </View>
            </View>
          </Card.Body>
        </Card>
      </Animated.View>

      {/* Mastery Threshold Info */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(200).easing(Easing.out(Easing.ease))}
        className="mb-6"
      >
        <View
          className={cn(
            'flex-row items-center gap-3 p-4 rounded-2xl',
            passed ? 'bg-success/10' : 'bg-warning/10'
          )}
        >
          <View
            className={cn(
              'w-10 h-10 rounded-full items-center justify-center',
              passed ? 'bg-success/20' : 'bg-warning/20'
            )}
          >
            <StyledFeather
              name={passed ? 'award' : 'target'}
              size={20}
              className={passed ? 'text-success' : 'text-warning'}
            />
          </View>
          <View className="flex-1">
            <AppText
              className={cn('font-semibold', passed ? 'text-success' : 'text-warning')}
            >
              {passed ? 'Mastery Achieved!' : `${masteryThreshold}% Required for Mastery`}
            </AppText>
            <AppText className="text-muted text-sm">
              {passed
                ? 'You\'ve met the mastery threshold for this lesson.'
                : `You need ${masteryThreshold - scorePercent}% more to achieve mastery.`}
            </AppText>
          </View>
        </View>
      </Animated.View>

      {/* Character Reactions */}
      {reactions.length > 0 && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(300).easing(Easing.out(Easing.ease))}
          className="mb-4"
        >
          <AppText className="text-foreground font-semibold text-lg mb-3">
            Team Feedback
          </AppText>
          <View className="gap-3">
            {reactions.map((reaction, index) => (
              <Card key={index}>
                <Card.Body className="p-4">
                  <View className="flex-row items-start gap-3">
                    <View
                      className={cn(
                        'w-12 h-12 rounded-full items-center justify-center',
                        reaction.isCorrect ? 'bg-success/15' : 'bg-warning/15'
                      )}
                    >
                      <AppText className="text-2xl">
                        {characterEmojis[reaction.character] || '👤'}
                      </AppText>
                    </View>
                    <View className="flex-1">
                      <AppText className="text-accent text-xs font-semibold uppercase mb-1">
                        {reaction.character}
                      </AppText>
                      <AppText className="text-foreground leading-5">
                        "{reaction.text}"
                      </AppText>
                    </View>
                  </View>
                </Card.Body>
              </Card>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Continue Encouragement */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(400).easing(Easing.out(Easing.ease))}
      >
        <View className="items-center py-4">
          <AppText className="text-muted text-center text-sm">
            {passed
              ? 'Continue to the next section to apply what you\'ve learned.'
              : 'Review the material and try again to improve your understanding.'}
          </AppText>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
