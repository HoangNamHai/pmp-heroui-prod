import Feather from '@expo/vector-icons/Feather';
import { Card, cn } from 'heroui-native';
import { useState, useEffect } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../app-text';

const StyledFeather = withUniwind(Feather);

// Helper to count words in a string
const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

interface AnsweredQuestion {
  answer: string;
  isCorrect: boolean;
}

interface TransferScreenProps {
  screen: any;
  onAnswer: (questionId: string, answer: string, isCorrect: boolean, points: number) => void;
  answeredQuestions: Record<string, AnsweredQuestion>;
}

export function TransferScreen({ screen, onAnswer, answeredQuestions }: TransferScreenProps) {
  const questions = screen.questions || [];
  const scenario = screen.scenario || {};

  // Find the first unanswered question
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for matching answers
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});

  // State for free text answer
  const [freeTextAnswer, setFreeTextAnswer] = useState('');

  useEffect(() => {
    // Find first unanswered question
    const firstUnanswered = questions.findIndex((q: any) => !answeredQuestions[q.id]);
    if (firstUnanswered !== -1) {
      setCurrentIndex(firstUnanswered);
    }
  }, []);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isAnswered = currentQuestion && answeredQuestions[currentQuestion.id];

  // Reset state when question changes
  useEffect(() => {
    setMatchingAnswers({});
    setFreeTextAnswer('');
  }, [currentIndex]);

  // Single choice handler
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

  // Matching handler
  const handleMatchingSelect = (itemId: string, matchValue: string) => {
    if (answeredQuestions[currentQuestion.id]) return;
    setMatchingAnswers((prev) => ({ ...prev, [itemId]: matchValue }));
  };

  // Matching submit handler
  const handleMatchingSubmit = () => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;

    const items = currentQuestion.items || [];
    let correctCount = 0;

    items.forEach((item: any) => {
      const selectedMatch = matchingAnswers[item.id];
      if (selectedMatch === item.match) {
        correctCount++;
      }
    });

    const isCorrect = correctCount === items.length;
    const partialPoints = Math.round((correctCount / items.length) * currentQuestion.points);

    onAnswer(
      currentQuestion.id,
      JSON.stringify(matchingAnswers),
      isCorrect,
      isCorrect ? currentQuestion.points : partialPoints
    );

    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    }
  };

  // Free text submit handler
  const handleFreeTextSubmit = () => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;

    const wordCount = countWords(freeTextAnswer);
    const meetsMinWords = wordCount >= (currentQuestion.minWords || 0);
    const meetsMaxWords = wordCount <= (currentQuestion.maxWords || 999);

    // For free text, give points if word requirements are met
    const isCorrect = meetsMinWords && meetsMaxWords;

    onAnswer(currentQuestion.id, freeTextAnswer, isCorrect, isCorrect ? currentQuestion.points : 0);

    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    }
  };

  if (!currentQuestion) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText className="text-muted">No transfer questions available</AppText>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 py-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Apply Section Header */}
      <Animated.View
        entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))}
        className="mb-4"
      >
        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-8 h-8 rounded-full bg-accent/15 items-center justify-center">
            <StyledFeather name="zap" size={16} className="text-accent" />
          </View>
          <AppText className="text-accent text-sm font-semibold uppercase">
            Apply Your Knowledge
          </AppText>
        </View>
        {screen.context && (
          <AppText className="text-muted leading-5">{screen.context}</AppText>
        )}
      </Animated.View>

      {/* Scenario Card - only show if scenario has content */}
      {(scenario.title || scenario.details?.length > 0) && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(100).easing(Easing.out(Easing.ease))}
          className="mb-6"
        >
          <Card>
            <Card.Body className="p-4">
              {scenario.title && (
                <AppText className="text-foreground font-semibold text-lg mb-3">
                  {scenario.title}
                </AppText>
              )}
              {scenario.details && scenario.details.length > 0 && (
                <View className="gap-2">
                  {scenario.details.map((detail: string, index: number) => (
                    <View key={index} className="flex-row items-start gap-2">
                      <View className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                      <AppText className="text-foreground flex-1 leading-5">{detail}</AppText>
                    </View>
                  ))}
                </View>
              )}
            </Card.Body>
          </Card>
        </Animated.View>
      )}

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
        {questions.map((_: any, index: number) => {
          const q = questions[index];
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

      {/* Question */}
      <AppText className="text-foreground font-semibold text-lg mb-4">
        {currentQuestion.question}
      </AppText>

      {/* Single Choice Options */}
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
                    showResult &&
                      !isSelected &&
                      !isCorrectOption &&
                      'border-transparent bg-content1 opacity-40'
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

      {/* Matching Question */}
      {currentQuestion.type === 'matching' && currentQuestion.items && (
        <View className="gap-4">
          {currentQuestion.items.map((item: any) => {
            const selectedMatch = matchingAnswers[item.id];
            const showResult = isAnswered;
            const isCorrectMatch = selectedMatch === item.match;

            return (
              <View key={item.id} className="gap-2">
                {/* Label */}
                <View
                  className={cn(
                    'px-4 py-3 rounded-xl',
                    showResult && isCorrectMatch && 'bg-success/15',
                    showResult && !isCorrectMatch && 'bg-danger/15',
                    !showResult && 'bg-accent/15'
                  )}
                >
                  <AppText
                    className={cn(
                      'font-semibold',
                      showResult && isCorrectMatch && 'text-success',
                      showResult && !isCorrectMatch && 'text-danger',
                      !showResult && 'text-accent'
                    )}
                  >
                    {item.label}
                  </AppText>
                </View>

                {/* Match Input */}
                <Pressable
                  onPress={() => {
                    // Cycle through available matches
                    const allMatches = currentQuestion.items.map((i: any) => i.match);
                    const currentIdx = selectedMatch ? allMatches.indexOf(selectedMatch) : -1;
                    const nextIdx = (currentIdx + 1) % allMatches.length;
                    handleMatchingSelect(item.id, allMatches[nextIdx]);
                  }}
                  disabled={!!isAnswered}
                >
                  <View
                    className={cn(
                      'px-4 py-3 rounded-xl border-2 flex-row items-center justify-between',
                      !showResult && 'border-divider bg-content1',
                      showResult && isCorrectMatch && 'border-success bg-success/10',
                      showResult && !isCorrectMatch && 'border-danger bg-danger/10'
                    )}
                  >
                    <AppText
                      className={cn(
                        'flex-1',
                        !selectedMatch && 'text-muted',
                        showResult && isCorrectMatch && 'text-success',
                        showResult && !isCorrectMatch && 'text-danger'
                      )}
                      numberOfLines={2}
                    >
                      {selectedMatch || 'Tap to select...'}
                    </AppText>
                    {!isAnswered && (
                      <StyledFeather name="chevron-down" size={18} className="text-muted" />
                    )}
                    {showResult && isCorrectMatch && (
                      <StyledFeather name="check" size={18} className="text-success" />
                    )}
                    {showResult && !isCorrectMatch && (
                      <StyledFeather name="x" size={18} className="text-danger" />
                    )}
                  </View>
                </Pressable>

                {/* Show correct answer if wrong */}
                {showResult && !isCorrectMatch && (
                  <AppText className="text-success text-sm ml-2">Correct: {item.match}</AppText>
                )}
              </View>
            );
          })}

          {/* Submit Button for Matching */}
          {!isAnswered && (
            <Pressable
              className={cn(
                'mt-4 py-4 rounded-xl items-center justify-center',
                Object.keys(matchingAnswers).length < currentQuestion.items.length
                  ? 'bg-default/30'
                  : 'bg-accent active:opacity-80'
              )}
              onPress={handleMatchingSubmit}
              disabled={Object.keys(matchingAnswers).length < currentQuestion.items.length}
            >
              <AppText
                className={cn(
                  'font-semibold',
                  Object.keys(matchingAnswers).length < currentQuestion.items.length
                    ? 'text-muted'
                    : 'text-white'
                )}
              >
                Submit Answer
              </AppText>
            </Pressable>
          )}
        </View>
      )}

      {/* Free Text Question */}
      {currentQuestion.type === 'free_text' && (
        <View className="gap-4">
          <View>
            <AppText className="text-muted text-sm mb-2">
              Your Answer ({currentQuestion.minWords}-{currentQuestion.maxWords} words)
            </AppText>
            <TextInput
              placeholder="Type your answer here..."
              value={freeTextAnswer}
              onChangeText={setFreeTextAnswer}
              multiline
              numberOfLines={6}
              editable={!isAnswered}
              className="p-4 rounded-2xl border-2 border-divider bg-content1 text-foreground min-h-[150px] text-base"
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
          </View>

          {/* Word Count */}
          <View className="flex-row justify-between">
            <AppText
              className={cn(
                'text-sm',
                countWords(freeTextAnswer) < (currentQuestion.minWords || 0)
                  ? 'text-danger'
                  : countWords(freeTextAnswer) > (currentQuestion.maxWords || 999)
                    ? 'text-danger'
                    : 'text-success'
              )}
            >
              {countWords(freeTextAnswer)} / {currentQuestion.minWords}-{currentQuestion.maxWords}{' '}
              words
            </AppText>
          </View>

          {/* Success Criteria */}
          {currentQuestion.successCriteria && (
            <View className="mt-2">
              <AppText className="text-muted text-sm font-medium mb-2">Consider including:</AppText>
              {currentQuestion.successCriteria.map((criteria: string, idx: number) => (
                <View key={idx} className="flex-row items-start gap-2 mb-1">
                  <View className="w-1.5 h-1.5 rounded-full bg-muted mt-2" />
                  <AppText className="text-muted text-sm flex-1">{criteria}</AppText>
                </View>
              ))}
            </View>
          )}

          {/* Submit Button for Free Text */}
          {!isAnswered && (
            <Pressable
              className={cn(
                'mt-4 py-4 rounded-xl items-center justify-center',
                countWords(freeTextAnswer) < (currentQuestion.minWords || 0)
                  ? 'bg-default/30'
                  : 'bg-accent active:opacity-80'
              )}
              onPress={handleFreeTextSubmit}
              disabled={countWords(freeTextAnswer) < (currentQuestion.minWords || 0)}
            >
              <AppText
                className={cn(
                  'font-semibold',
                  countWords(freeTextAnswer) < (currentQuestion.minWords || 0)
                    ? 'text-muted'
                    : 'text-white'
                )}
              >
                Submit Answer
              </AppText>
            </Pressable>
          )}

          {/* Model Answer (shown after submission) */}
          {isAnswered && currentQuestion.modelAnswer && (
            <View className="mt-4 p-4 rounded-2xl bg-success/10">
              <AppText className="text-success font-semibold mb-2">Model Answer:</AppText>
              <AppText className="text-foreground leading-5">{currentQuestion.modelAnswer}</AppText>
            </View>
          )}
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
                    answeredQuestions[currentQuestion.id].isCorrect
                      ? 'text-success/80'
                      : 'text-foreground'
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
