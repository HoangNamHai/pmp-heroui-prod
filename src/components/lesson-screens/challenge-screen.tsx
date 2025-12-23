import Feather from '@expo/vector-icons/Feather';
import { Card, cn } from 'heroui-native';
import { useState, useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../app-text';

const StyledFeather = withUniwind(Feather);

interface ChallengeScreenProps {
  screen: any;
  onAnswer: (questionId: string, answer: string, isCorrect: boolean, points: number) => void;
  answeredQuestions: Record<string, { answer: string; isCorrect: boolean }>;
}

export function ChallengeScreen({ screen, onAnswer, answeredQuestions }: ChallengeScreenProps) {
  const scenarios = screen.scenarios || [];

  // Flatten all questions with scenario context
  const allQuestions = scenarios.flatMap((scenario: any, scenarioIndex: number) =>
    (scenario.questions || []).map((question: any, questionIndex: number) => ({
      ...question,
      scenario,
      scenarioIndex,
      questionIndex,
    }))
  );

  // Find the first unanswered question, or show the last answered one
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Find first unanswered question
    const firstUnanswered = allQuestions.findIndex((q: any) => !answeredQuestions[q.id]);
    if (firstUnanswered !== -1) {
      setCurrentIndex(firstUnanswered);
    }
  }, []);

  const currentQuestion = allQuestions[currentIndex];
  const totalQuestions = allQuestions.length;

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;

    const isCorrect = currentQuestion.correctAnswer === optionId;
    onAnswer(currentQuestion.id, optionId, isCorrect, isCorrect ? currentQuestion.points : 0);

    // Auto-advance to next question after a short delay
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 1500);
    }
  };

  const isAnswered = currentQuestion && answeredQuestions[currentQuestion.id];

  if (!currentQuestion) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText className="text-muted">No challenges available</AppText>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 py-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Question Counter */}
      <View className="flex-row items-center justify-between mb-2">
        <AppText className="text-muted text-sm">
          Question {currentIndex + 1} of {totalQuestions}
        </AppText>
        <AppText className="text-accent text-sm font-medium">
          {currentQuestion.points} pts
        </AppText>
      </View>

      {/* Mini Progress Dots */}
      <View className="flex-row gap-1.5 mb-6">
        {allQuestions.map((_: any, index: number) => {
          const q = allQuestions[index];
          const answered = answeredQuestions[q.id];
          return (
            <View
              key={index}
              className={cn(
                'h-1.5 flex-1 rounded-full',
                index === currentIndex && 'bg-accent',
                index !== currentIndex && answered?.isCorrect && 'bg-success',
                index !== currentIndex && answered && !answered.isCorrect && 'bg-danger',
                index !== currentIndex && !answered && 'bg-default'
              )}
            />
          );
        })}
      </View>

      {/* Scenario Title */}
      <AppText className="text-foreground text-xl font-bold mb-3">
        {currentQuestion.scenario.title}
      </AppText>

      {/* Scenario Description */}
      <Card className="mb-6">
        <Card.Body className="p-4">
          {currentQuestion.scenario.description.map((item: string, index: number) => (
            <View key={index} className="flex-row items-start gap-2 mb-1.5 last:mb-0">
              <View className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
              <AppText className="text-foreground flex-1 leading-5">{item}</AppText>
            </View>
          ))}
        </Card.Body>
      </Card>

      {/* Question */}
      <AppText className="text-foreground font-semibold text-lg mb-4">
        {currentQuestion.question}
      </AppText>

      {/* Options */}
      {currentQuestion.type === 'single_choice' && currentQuestion.options && (
        <View className="gap-3">
          {currentQuestion.options.map((option: any) => {
            const isSelected = answeredQuestions[currentQuestion.id]?.answer === option.id;
            const isCorrectOption = currentQuestion.correctAnswer === option.id;
            const showResult = isAnswered;

            return (
              <Pressable
                key={option.id}
                onPress={() => handleSelectOption(option.id)}
                disabled={!!isAnswered}
              >
                <View
                  className={cn(
                    'p-4 rounded-2xl border-2',
                    !showResult && 'border-divider bg-content1',
                    showResult && isCorrectOption && 'border-success bg-success/10',
                    showResult && isSelected && !isCorrectOption && 'border-danger bg-danger/10',
                    showResult && !isSelected && !isCorrectOption && 'border-transparent bg-content1 opacity-40'
                  )}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className={cn(
                        'w-10 h-10 rounded-full items-center justify-center',
                        !showResult && 'bg-default',
                        showResult && isCorrectOption && 'bg-success',
                        showResult && isSelected && !isCorrectOption && 'bg-danger'
                      )}
                    >
                      {showResult && isCorrectOption ? (
                        <StyledFeather name="check" size={20} className="text-white" />
                      ) : showResult && isSelected && !isCorrectOption ? (
                        <StyledFeather name="x" size={20} className="text-white" />
                      ) : (
                        <AppText className="text-muted font-semibold">
                          {option.id.toUpperCase()}
                        </AppText>
                      )}
                    </View>
                    <AppText
                      className={cn(
                        'flex-1 text-base',
                        showResult && isCorrectOption && 'text-success font-medium',
                        showResult && isSelected && !isCorrectOption && 'text-danger',
                        !showResult && 'text-foreground'
                      )}
                    >
                      {option.text}
                    </AppText>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Feedback */}
      {isAnswered && currentQuestion.feedback && (
        <Animated.View
          entering={FadeInUp.duration(400).easing(Easing.out(Easing.ease))}
          className="mt-6"
        >
          <View
            className={cn(
              'p-4 rounded-2xl',
              answeredQuestions[currentQuestion.id].isCorrect ? 'bg-success/15' : 'bg-danger/15'
            )}
          >
            <View className="flex-row items-start gap-3">
              <View
                className={cn(
                  'w-10 h-10 rounded-full items-center justify-center',
                  answeredQuestions[currentQuestion.id].isCorrect ? 'bg-success/20' : 'bg-danger/20'
                )}
              >
                {answeredQuestions[currentQuestion.id].isCorrect ? (
                  <StyledFeather name="check-circle" size={20} className="text-success" />
                ) : (
                  <StyledFeather name="info" size={20} className="text-danger" />
                )}
              </View>
              <View className="flex-1">
                <AppText
                  className={cn(
                    'font-semibold mb-1',
                    answeredQuestions[currentQuestion.id].isCorrect ? 'text-success' : 'text-danger'
                  )}
                >
                  {answeredQuestions[currentQuestion.id].isCorrect ? 'Correct!' : 'Not quite'}
                </AppText>
                <AppText
                  className={cn(
                    'leading-5',
                    answeredQuestions[currentQuestion.id].isCorrect ? 'text-success/80' : 'text-foreground'
                  )}
                >
                  {answeredQuestions[currentQuestion.id].isCorrect
                    ? currentQuestion.feedback.correct
                    : currentQuestion.feedback.incorrect}
                </AppText>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}
