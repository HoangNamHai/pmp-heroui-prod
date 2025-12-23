import Feather from '@expo/vector-icons/Feather';
import { Button, Card, cn } from 'heroui-native';
import { useState, useEffect } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import Animated, { FadeInUp, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../app-text';

const StyledFeather = withUniwind(Feather);

// Helper to count words in a string
const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

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

  // State for multi_select
  const [multiSelectAnswers, setMultiSelectAnswers] = useState<string[]>([]);

  // State for matching - maps item id to selected match value
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [expandedMatchItem, setExpandedMatchItem] = useState<string | null>(null);

  // State for ranking - ordered list of option ids
  const [rankingOrder, setRankingOrder] = useState<string[]>([]);

  // State for free_text
  const [freeTextAnswer, setFreeTextAnswer] = useState('');

  useEffect(() => {
    // Find first unanswered question
    const firstUnanswered = allQuestions.findIndex((q: any) => !answeredQuestions[q.id]);
    if (firstUnanswered !== -1) {
      setCurrentIndex(firstUnanswered);
    }
  }, []);

  const currentQuestion = allQuestions[currentIndex];
  const totalQuestions = allQuestions.length;

  // Reset state when question changes
  useEffect(() => {
    setMultiSelectAnswers([]);
    setMatchingAnswers({});
    setExpandedMatchItem(null);
    setFreeTextAnswer('');
    setRankingOrder([]);

    // Initialize ranking order
    if (currentQuestion?.type === 'ranking' && currentQuestion.options) {
      setRankingOrder(currentQuestion.options.map((opt: any) => opt.id));
    }
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

  // Multi-select toggle handler
  const handleMultiSelectToggle = (optionId: string) => {
    if (answeredQuestions[currentQuestion.id]) return;
    setMultiSelectAnswers(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  // Multi-select submit handler
  const handleMultiSelectSubmit = () => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;

    const correctAnswers = currentQuestion.correctAnswers ||
      currentQuestion.options?.filter((o: any) => o.isValid || o.isStakeholder).map((o: any) => o.id) || [];

    const isCorrect =
      multiSelectAnswers.length === correctAnswers.length &&
      multiSelectAnswers.every((id: string) => correctAnswers.includes(id));

    onAnswer(currentQuestion.id, multiSelectAnswers.join(','), isCorrect, isCorrect ? currentQuestion.points : 0);

    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    }
  };

  // Matching handler - set selected match value
  const handleMatchingSelect = (itemId: string, matchValue: string) => {
    if (answeredQuestions[currentQuestion.id]) return;
    setMatchingAnswers(prev => ({ ...prev, [itemId]: matchValue }));
    setExpandedMatchItem(null); // Collapse after selection
  };

  // Toggle expanded state for matching item
  const toggleMatchExpanded = (itemId: string) => {
    if (answeredQuestions[currentQuestion.id]) return;
    setExpandedMatchItem(prev => prev === itemId ? null : itemId);
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

    onAnswer(currentQuestion.id, JSON.stringify(matchingAnswers), isCorrect, isCorrect ? currentQuestion.points : partialPoints);

    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    }
  };

  // Ranking move handler
  const handleRankingMove = (index: number, direction: 'up' | 'down') => {
    if (answeredQuestions[currentQuestion.id]) return;

    const newOrder = [...rankingOrder];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex >= 0 && swapIndex < newOrder.length) {
      [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
      setRankingOrder(newOrder);
    }
  };

  // Ranking submit handler
  const handleRankingSubmit = () => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;

    const options = currentQuestion.options || [];
    let correctCount = 0;

    rankingOrder.forEach((id, index) => {
      const option = options.find((o: any) => o.id === id);
      if (option && option.idealRank === index + 1) {
        correctCount++;
      }
    });

    const isCorrect = correctCount === options.length;
    const partialPoints = Math.round((correctCount / options.length) * currentQuestion.points);

    onAnswer(currentQuestion.id, rankingOrder.join(','), isCorrect, isCorrect ? currentQuestion.points : partialPoints);

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

    // For free text, we give points if they meet word requirements (actual grading would need AI)
    const isCorrect = meetsMinWords && meetsMaxWords;

    onAnswer(currentQuestion.id, freeTextAnswer, isCorrect, isCorrect ? currentQuestion.points : 0);

    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
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

      {/* Multi-Select Options */}
      {currentQuestion.type === 'multi_select' && currentQuestion.options && (
        <View className="gap-3">
          {currentQuestion.instructions && (
            <AppText className="text-muted text-sm mb-2">{currentQuestion.instructions}</AppText>
          )}
          {currentQuestion.options.map((option: any) => {
            const isSelected = multiSelectAnswers.includes(option.id);
            const isValidOption = option.isValid || option.isStakeholder;
            const showResult = isAnswered;
            const wasSelected = answeredQuestions[currentQuestion.id]?.answer?.split(',').includes(option.id);

            return (
              <Pressable
                key={option.id}
                onPress={() => handleMultiSelectToggle(option.id)}
                disabled={!!isAnswered}
              >
                <View
                  className={cn(
                    'p-4 rounded-2xl border-2',
                    !showResult && !isSelected && 'border-divider bg-content1',
                    !showResult && isSelected && 'border-accent bg-accent/10',
                    showResult && wasSelected && isValidOption && 'border-success bg-success/10',
                    showResult && wasSelected && !isValidOption && 'border-danger bg-danger/10',
                    showResult && !wasSelected && isValidOption && 'border-success/50 bg-success/5',
                    showResult && !wasSelected && !isValidOption && 'border-transparent bg-content1 opacity-40'
                  )}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className={cn(
                        'w-6 h-6 rounded border-2 items-center justify-center',
                        !showResult && !isSelected && 'border-muted',
                        !showResult && isSelected && 'border-accent bg-accent',
                        showResult && isValidOption && 'border-success bg-success',
                        showResult && !isValidOption && wasSelected && 'border-danger bg-danger',
                        showResult && !isValidOption && !wasSelected && 'border-muted'
                      )}
                    >
                      {(isSelected || (showResult && isValidOption)) && (
                        <StyledFeather name="check" size={14} className="text-white" />
                      )}
                      {showResult && wasSelected && !isValidOption && (
                        <StyledFeather name="x" size={14} className="text-white" />
                      )}
                    </View>
                    <AppText
                      className={cn(
                        'flex-1 text-base',
                        showResult && isValidOption && 'text-success',
                        showResult && wasSelected && !isValidOption && 'text-danger',
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

          {/* Submit Button for Multi-Select */}
          {!isAnswered && (
            <Button
              color="primary"
              className="mt-4"
              onPress={handleMultiSelectSubmit}
              isDisabled={multiSelectAnswers.length === 0}
            >
              Submit Answer
            </Button>
          )}
        </View>
      )}

      {/* Matching Question */}
      {currentQuestion.type === 'matching' && currentQuestion.items && (
        <View className="gap-4">
          {currentQuestion.items.map((item: any) => {
            const selectedMatch = matchingAnswers[item.id];
            const showResult = isAnswered;
            const isCorrectMatch = selectedMatch === item.match;
            const allMatches = currentQuestion.items.map((i: any) => i.match);
            const isExpanded = expandedMatchItem === item.id;

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

                {/* Match Selection - Expandable */}
                {!showResult ? (
                  <View>
                    {/* Trigger Button */}
                    <Pressable onPress={() => toggleMatchExpanded(item.id)}>
                      <View
                        className={cn(
                          'px-4 py-3 rounded-xl border-2 flex-row items-center justify-between',
                          isExpanded ? 'border-accent bg-accent/5' : 'border-divider bg-content1',
                          selectedMatch && !isExpanded && 'border-accent/50'
                        )}
                      >
                        <AppText className={cn('flex-1', !selectedMatch && 'text-muted')}>
                          {selectedMatch || 'Select a match...'}
                        </AppText>
                        <StyledFeather
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          className="text-muted"
                        />
                      </View>
                    </Pressable>

                    {/* Expanded Options */}
                    {isExpanded && (
                      <Animated.View
                        entering={FadeInUp.duration(200)}
                        className="mt-2 gap-2"
                      >
                        {allMatches.map((match: string, idx: number) => {
                          const isSelected = selectedMatch === match;
                          const isUsedByOther = Object.entries(matchingAnswers).some(
                            ([key, val]) => key !== item.id && val === match
                          );

                          return (
                            <Pressable
                              key={idx}
                              onPress={() => handleMatchingSelect(item.id, match)}
                              disabled={isUsedByOther}
                            >
                              <View
                                className={cn(
                                  'px-4 py-3 rounded-xl border-2',
                                  isSelected && 'border-accent bg-accent/10',
                                  !isSelected && !isUsedByOther && 'border-divider bg-content1',
                                  isUsedByOther && 'border-divider bg-default/50 opacity-50'
                                )}
                              >
                                <View className="flex-row items-center gap-3">
                                  <View
                                    className={cn(
                                      'w-5 h-5 rounded-full border-2 items-center justify-center',
                                      isSelected ? 'border-accent bg-accent' : 'border-muted'
                                    )}
                                  >
                                    {isSelected && (
                                      <StyledFeather name="check" size={12} className="text-white" />
                                    )}
                                  </View>
                                  <AppText
                                    className={cn(
                                      'flex-1 text-sm',
                                      isSelected && 'text-accent font-medium',
                                      isUsedByOther && 'text-muted'
                                    )}
                                  >
                                    {match}
                                  </AppText>
                                  {isUsedByOther && (
                                    <AppText className="text-muted text-xs">(used)</AppText>
                                  )}
                                </View>
                              </View>
                            </Pressable>
                          );
                        })}
                      </Animated.View>
                    )}
                  </View>
                ) : (
                  <View
                    className={cn(
                      'px-4 py-3 rounded-xl border-2 flex-row items-center justify-between',
                      isCorrectMatch && 'border-success bg-success/10',
                      !isCorrectMatch && 'border-danger bg-danger/10'
                    )}
                  >
                    <AppText
                      className={cn(
                        'flex-1',
                        isCorrectMatch && 'text-success',
                        !isCorrectMatch && 'text-danger'
                      )}
                    >
                      {selectedMatch || 'Not answered'}
                    </AppText>
                    {isCorrectMatch ? (
                      <StyledFeather name="check" size={18} className="text-success" />
                    ) : (
                      <StyledFeather name="x" size={18} className="text-danger" />
                    )}
                  </View>
                )}

                {/* Show correct answer if wrong */}
                {showResult && !isCorrectMatch && (
                  <AppText className="text-success text-sm ml-2">
                    Correct: {item.match}
                  </AppText>
                )}
              </View>
            );
          })}

          {/* Submit Button for Matching */}
          {!isAnswered && (
            <Button
              color="primary"
              className="mt-4"
              onPress={handleMatchingSubmit}
              isDisabled={Object.keys(matchingAnswers).length < currentQuestion.items.length}
            >
              Submit Answer
            </Button>
          )}
        </View>
      )}

      {/* Ranking Question */}
      {currentQuestion.type === 'ranking' && currentQuestion.options && (
        <View className="gap-3">
          {rankingOrder.map((optionId, index) => {
            const option = currentQuestion.options.find((o: any) => o.id === optionId);
            if (!option) return null;

            const showResult = isAnswered;
            const isCorrectPosition = option.idealRank === index + 1;

            return (
              <View
                key={optionId}
                className={cn(
                  'flex-row items-center gap-3 p-4 rounded-2xl border-2',
                  !showResult && 'border-divider bg-content1',
                  showResult && isCorrectPosition && 'border-success bg-success/10',
                  showResult && !isCorrectPosition && 'border-danger bg-danger/10'
                )}
              >
                {/* Rank Number */}
                <View
                  className={cn(
                    'w-8 h-8 rounded-full items-center justify-center',
                    !showResult && 'bg-accent',
                    showResult && isCorrectPosition && 'bg-success',
                    showResult && !isCorrectPosition && 'bg-danger'
                  )}
                >
                  <AppText className="text-white font-bold">{index + 1}</AppText>
                </View>

                {/* Option Text */}
                <AppText
                  className={cn(
                    'flex-1',
                    showResult && isCorrectPosition && 'text-success',
                    showResult && !isCorrectPosition && 'text-danger',
                    !showResult && 'text-foreground'
                  )}
                >
                  {option.text}
                </AppText>

                {/* Move Buttons */}
                {!isAnswered && (
                  <View className="flex-row gap-1">
                    <Pressable
                      onPress={() => handleRankingMove(index, 'up')}
                      disabled={index === 0}
                      className={cn('p-2', index === 0 && 'opacity-30')}
                    >
                      <StyledFeather name="chevron-up" size={20} className="text-muted" />
                    </Pressable>
                    <Pressable
                      onPress={() => handleRankingMove(index, 'down')}
                      disabled={index === rankingOrder.length - 1}
                      className={cn('p-2', index === rankingOrder.length - 1 && 'opacity-30')}
                    >
                      <StyledFeather name="chevron-down" size={20} className="text-muted" />
                    </Pressable>
                  </View>
                )}

                {/* Result Icon */}
                {showResult && (
                  <View>
                    {isCorrectPosition ? (
                      <StyledFeather name="check" size={20} className="text-success" />
                    ) : (
                      <AppText className="text-danger text-sm">#{option.idealRank}</AppText>
                    )}
                  </View>
                )}
              </View>
            );
          })}

          {/* Submit Button for Ranking */}
          {!isAnswered && (
            <Button
              color="primary"
              className="mt-4"
              onPress={handleRankingSubmit}
            >
              Submit Answer
            </Button>
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
              {countWords(freeTextAnswer)} / {currentQuestion.minWords}-{currentQuestion.maxWords} words
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
            <Button
              color="primary"
              className="mt-4"
              onPress={handleFreeTextSubmit}
              isDisabled={countWords(freeTextAnswer) < (currentQuestion.minWords || 0)}
            >
              Submit Answer
            </Button>
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
