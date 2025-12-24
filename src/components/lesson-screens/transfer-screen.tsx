import Feather from '@expo/vector-icons/Feather';
import { Button, Card, cn } from 'heroui-native';
import { useState, useEffect, useCallback } from 'react';
import { Dimensions, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../app-text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const StyledFeather = withUniwind(Feather);

// Helper to count words in a string
const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

// ============================================
// SWIPE CLASSIFIER COMPONENT (Transfer)
// ============================================
interface SwipeClassifierProps {
  question: any;
  swipeCardIndex: number;
  swipeAnswers: Record<string, 'left' | 'right'>;
  isAnswered: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
}

function SwipeClassifierQuestion({
  question,
  swipeCardIndex,
  swipeAnswers,
  isAnswered,
  onSwipe,
}: SwipeClassifierProps) {
  const cards = question.cards || [];
  const currentCard = cards[swipeCardIndex];
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isAnswered) return;
      translateX.value = event.translationX;
      rotate.value = interpolate(event.translationX, [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2], [-15, 15]);
    })
    .onEnd((event) => {
      if (isAnswered) return;
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        translateX.value = withTiming(event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH, { duration: 200 });
        runOnJS(onSwipe)(direction);
        setTimeout(() => {
          translateX.value = 0;
          rotate.value = 0;
        }, 250);
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const leftIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const rightIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  if (isAnswered) {
    return (
      <View className="gap-4">
        <AppText className="text-muted text-sm mb-2">Results:</AppText>
        {cards.map((card: any) => {
          const userAnswer = swipeAnswers[card.id];
          const isCorrect = userAnswer === card.correctAnswer;
          return (
            <View
              key={card.id}
              className={cn(
                'p-4 rounded-2xl border-2',
                isCorrect ? 'border-success bg-success/10' : 'border-danger bg-danger/10'
              )}
            >
              <View className="flex-row items-start gap-3">
                <View className={cn('w-8 h-8 rounded-full items-center justify-center', isCorrect ? 'bg-success' : 'bg-danger')}>
                  {isCorrect ? (
                    <StyledFeather name="check" size={16} className="text-white" />
                  ) : (
                    <StyledFeather name="x" size={16} className="text-white" />
                  )}
                </View>
                <View className="flex-1">
                  <AppText className={cn('font-medium mb-1', isCorrect ? 'text-success' : 'text-danger')}>
                    {card.statement}
                  </AppText>
                  <AppText className="text-muted text-sm">
                    You: {userAnswer === 'right' ? 'Likely' : 'Not Likely'} |
                    Correct: {card.correctAnswer === 'right' ? 'Likely' : 'Not Likely'}
                  </AppText>
                  {card.explanation && (
                    <AppText className="text-foreground/70 text-sm mt-1">{card.explanation}</AppText>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  if (!currentCard) return null;

  return (
    <View className="gap-4">
      {question.instruction && (
        <AppText className="text-muted text-sm text-center">{question.instruction}</AppText>
      )}
      <View className="flex-row justify-center gap-1.5 mb-2">
        {cards.map((_: any, idx: number) => (
          <View
            key={idx}
            className={cn(
              'w-2 h-2 rounded-full',
              idx < swipeCardIndex && 'bg-accent',
              idx === swipeCardIndex && 'bg-accent w-4',
              idx > swipeCardIndex && 'bg-default'
            )}
          />
        ))}
      </View>
      <View className="items-center min-h-[200px]">
        <GestureDetector gesture={panGesture}>
          <Animated.View style={cardStyle} className="w-full">
            <Card className="relative overflow-hidden">
              <Card.Body className="p-6">
                <Animated.View style={leftIndicatorStyle} className="absolute top-4 right-4 px-3 py-1 rounded-full bg-danger/20 border border-danger">
                  <AppText className="text-danger font-semibold text-sm">NOT LIKELY</AppText>
                </Animated.View>
                <Animated.View style={rightIndicatorStyle} className="absolute top-4 left-4 px-3 py-1 rounded-full bg-success/20 border border-success">
                  <AppText className="text-success font-semibold text-sm">LIKELY</AppText>
                </Animated.View>
                <View className="mt-8">
                  <AppText className="text-foreground text-lg text-center leading-6">{currentCard.statement}</AppText>
                </View>
              </Card.Body>
            </Card>
          </Animated.View>
        </GestureDetector>
      </View>
      <View className="flex-row justify-between px-4">
        <Pressable onPress={() => onSwipe('left')} className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-danger/10">
          <StyledFeather name="arrow-left" size={16} className="text-danger" />
          <AppText className="text-danger font-medium">Not Likely</AppText>
        </Pressable>
        <Pressable onPress={() => onSwipe('right')} className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-success/10">
          <AppText className="text-success font-medium">Likely</AppText>
          <StyledFeather name="arrow-right" size={16} className="text-success" />
        </Pressable>
      </View>
      <AppText className="text-muted text-sm text-center">Card {swipeCardIndex + 1} of {cards.length}</AppText>
    </View>
  );
}

// ============================================
// SENTENCE BUILDER COMPONENT (Transfer)
// ============================================
interface SentenceBuilderProps {
  question: any;
  selections: Record<string, string>;
  activeBlankId: string | null;
  isAnswered: boolean;
  onBlankPress: (blankId: string | null) => void;
  onWordSelect: (blankId: string, word: string) => void;
  onSubmit: () => void;
}

function SentenceBuilderQuestion({
  question,
  selections,
  activeBlankId,
  isAnswered,
  onBlankPress,
  onWordSelect,
  onSubmit,
}: SentenceBuilderProps) {
  const sentence = question.sentence || '';
  const blanks = question.blanks || [];
  const wordBank = question.wordBank || [];
  const parts = sentence.split(/\[________\]/);
  const usedWords = Object.values(selections);

  return (
    <View className="gap-4">
      {question.instruction && <AppText className="text-muted text-sm mb-2">{question.instruction}</AppText>}
      <Card>
        <Card.Body className="p-4">
          <View className="flex-row flex-wrap">
            {parts.map((part: string, idx: number) => (
              <View key={idx} className="flex-row flex-wrap items-center">
                <AppText className="text-foreground leading-7">{part}</AppText>
                {idx < blanks.length && (
                  <Pressable onPress={() => !isAnswered && onBlankPress(activeBlankId === blanks[idx].id ? null : blanks[idx].id)} disabled={isAnswered}>
                    <View
                      className={cn(
                        'mx-1 px-3 py-1 rounded-lg min-w-[100px] border-2 border-dashed',
                        activeBlankId === blanks[idx].id && 'border-accent bg-accent/10',
                        !activeBlankId && !selections[blanks[idx].id] && 'border-muted bg-default/30',
                        selections[blanks[idx].id] && !isAnswered && 'border-accent/50 bg-accent/5',
                        isAnswered && blanks[idx].correctAnswers?.includes(selections[blanks[idx].id]) && 'border-success bg-success/10',
                        isAnswered && !blanks[idx].correctAnswers?.includes(selections[blanks[idx].id]) && 'border-danger bg-danger/10'
                      )}
                    >
                      <AppText
                        className={cn(
                          'text-center text-sm',
                          !selections[blanks[idx].id] && 'text-muted',
                          selections[blanks[idx].id] && !isAnswered && 'text-accent font-medium',
                          isAnswered && blanks[idx].correctAnswers?.includes(selections[blanks[idx].id]) && 'text-success font-medium',
                          isAnswered && !blanks[idx].correctAnswers?.includes(selections[blanks[idx].id]) && 'text-danger font-medium'
                        )}
                      >
                        {selections[blanks[idx].id] || `(${idx + 1})`}
                      </AppText>
                    </View>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </Card.Body>
      </Card>
      {!isAnswered && activeBlankId && (
        <Animated.View entering={FadeIn.duration(200)} className="gap-2">
          <AppText className="text-muted text-sm font-medium">Select a word:</AppText>
          <View className="flex-row flex-wrap gap-2">
            {wordBank.map((word: any) => {
              const isUsed = usedWords.includes(word.text) && selections[activeBlankId] !== word.text;
              const isSelected = selections[activeBlankId] === word.text;
              return (
                <Pressable key={word.id} onPress={() => onWordSelect(activeBlankId, word.text)} disabled={isUsed}>
                  <View className={cn('px-3 py-2 rounded-xl border-2', isSelected && 'border-accent bg-accent/15', !isSelected && !isUsed && 'border-divider bg-content1', isUsed && 'border-divider bg-default/30 opacity-50')}>
                    <AppText className={cn('text-sm', isSelected && 'text-accent font-medium', !isSelected && !isUsed && 'text-foreground', isUsed && 'text-muted')}>{word.text}</AppText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      )}
      {isAnswered && (
        <View className="gap-2">
          {blanks.map((blank: any, idx: number) => {
            const isCorrect = blank.correctAnswers?.includes(selections[blank.id]);
            if (isCorrect) return null;
            return <AppText key={blank.id} className="text-success text-sm">Blank {idx + 1} correct: {blank.correctAnswers?.[0]}</AppText>;
          })}
        </View>
      )}
      {!isAnswered && (
        <Button color="primary" className="mt-4" onPress={onSubmit} isDisabled={Object.keys(selections).length < blanks.length}>
          Submit Answer
        </Button>
      )}
    </View>
  );
}

// ============================================
// STRATEGY BUILDER COMPONENT (Transfer)
// ============================================
interface StrategyBuilderProps {
  question: any;
  selections: string[];
  isAnswered: boolean;
  onToggle: (elementId: string) => void;
  onSubmit: () => void;
}

function StrategyBuilderQuestion({ question, selections, isAnswered, onToggle, onSubmit }: StrategyBuilderProps) {
  const elements = question.elements || [];
  const selectCount = question.selectCount || 4;

  return (
    <View className="gap-4">
      {question.instruction && <AppText className="text-muted text-sm mb-2">{question.instruction}</AppText>}
      <View className="flex-row items-center justify-between">
        <AppText className="text-muted text-sm">Select {selectCount} elements</AppText>
        <AppText className={cn('text-sm font-medium', selections.length === selectCount ? 'text-success' : 'text-accent')}>{selections.length} / {selectCount}</AppText>
      </View>
      <View className="gap-3">
        {elements.map((element: any) => {
          const isSelected = selections.includes(element.id);
          const showResult = isAnswered;
          return (
            <Pressable key={element.id} onPress={() => onToggle(element.id)} disabled={isAnswered || (!isSelected && selections.length >= selectCount)}>
              <View
                className={cn(
                  'p-4 rounded-2xl border-2',
                  !showResult && !isSelected && 'border-divider bg-content1',
                  !showResult && isSelected && 'border-accent bg-accent/10',
                  showResult && isSelected && element.isCorrect && 'border-success bg-success/10',
                  showResult && isSelected && !element.isCorrect && 'border-danger bg-danger/10',
                  showResult && !isSelected && element.isCorrect && 'border-success/50 bg-success/5',
                  showResult && !isSelected && !element.isCorrect && 'border-transparent bg-content1 opacity-40',
                  !isAnswered && !isSelected && selections.length >= selectCount && 'opacity-50'
                )}
              >
                <View className="flex-row items-start gap-3">
                  <View
                    className={cn(
                      'w-6 h-6 rounded-full border-2 items-center justify-center mt-0.5',
                      !showResult && !isSelected && 'border-muted',
                      !showResult && isSelected && 'border-accent bg-accent',
                      showResult && element.isCorrect && 'border-success bg-success',
                      showResult && !element.isCorrect && isSelected && 'border-danger bg-danger',
                      showResult && !element.isCorrect && !isSelected && 'border-muted'
                    )}
                  >
                    {(isSelected || (showResult && element.isCorrect)) && <StyledFeather name="check" size={14} className="text-white" />}
                    {showResult && isSelected && !element.isCorrect && <StyledFeather name="x" size={14} className="text-white" />}
                  </View>
                  <View className="flex-1">
                    <AppText className={cn('font-semibold mb-1', showResult && element.isCorrect && 'text-success', showResult && isSelected && !element.isCorrect && 'text-danger', !showResult && 'text-foreground')}>{element.label}</AppText>
                    {element.quote && <AppText className="text-muted text-sm italic">"{element.quote}"</AppText>}
                    {element.category && (
                      <View className="mt-2">
                        <View className={cn('self-start px-2 py-0.5 rounded-full', element.category === 'influence' && 'bg-success/15', element.category === 'authority' && 'bg-danger/15')}>
                          <AppText className={cn('text-xs font-medium', element.category === 'influence' && 'text-success', element.category === 'authority' && 'text-danger')}>{element.category}</AppText>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
      {!isAnswered && (
        <Button color="primary" className="mt-4" onPress={onSubmit} isDisabled={selections.length !== selectCount}>
          Submit Answer
        </Button>
      )}
    </View>
  );
}

// ============================================
// DIALOGUE SIMULATOR COMPONENT (Transfer)
// ============================================
interface DialogueSimulatorProps {
  question: any;
  currentTurnIndex: number;
  answers: Record<string, string>;
  totalPoints: number;
  isAnswered: boolean;
  onChoice: (turnId: string, optionId: string, points: number, isCorrect: boolean) => void;
}

function DialogueSimulatorQuestion({ question, currentTurnIndex, answers, totalPoints, isAnswered, onChoice }: DialogueSimulatorProps) {
  const turns = question.turns || [];

  return (
    <View className="gap-4">
      {question.instruction && <AppText className="text-muted text-sm mb-2">{question.instruction}</AppText>}
      <View className="flex-row items-center justify-end">
        <View className="px-3 py-1 rounded-full bg-accent/15">
          <AppText className="text-accent font-semibold text-sm">{totalPoints} pts earned</AppText>
        </View>
      </View>
      <View className="gap-4">
        {turns.map((turn: any, idx: number) => {
          const isVisible = idx <= currentTurnIndex || isAnswered;
          const isPast = idx < currentTurnIndex || isAnswered;
          const isCurrent = idx === currentTurnIndex && !isAnswered;
          const selectedOptionId = answers[turn.id];
          if (!isVisible) return null;
          return (
            <Animated.View key={turn.id} entering={FadeInUp.duration(300)} className="gap-3">
              <View className="flex-row items-start gap-3">
                <View className="w-10 h-10 rounded-full bg-default items-center justify-center">
                  <AppText className="text-lg">{turn.speaker === 'liam' ? '👨' : '🧑‍💼'}</AppText>
                </View>
                <View className="flex-1 p-3 rounded-2xl bg-surface">
                  <AppText className="text-muted text-xs font-medium mb-1 capitalize">{turn.speaker}</AppText>
                  <AppText className="text-foreground leading-5">{turn.text}</AppText>
                </View>
              </View>
              {(isCurrent || isPast) && (
                <View className="ml-13 gap-2">
                  {turn.options.map((option: any) => {
                    const isSelected = selectedOptionId === option.id;
                    const showResult = isPast || isAnswered;
                    return (
                      <Pressable key={option.id} onPress={() => onChoice(turn.id, option.id, option.points || 0, option.isCorrect)} disabled={isPast || isAnswered}>
                        <View
                          className={cn(
                            'p-3 rounded-xl border-2',
                            !showResult && 'border-divider bg-content1',
                            showResult && isSelected && option.isCorrect && 'border-success bg-success/10',
                            showResult && isSelected && !option.isCorrect && 'border-danger bg-danger/10',
                            showResult && !isSelected && option.isCorrect && 'border-success/30 bg-success/5',
                            showResult && !isSelected && !option.isCorrect && 'border-transparent bg-content1 opacity-40'
                          )}
                        >
                          <AppText className={cn('text-sm leading-5', showResult && isSelected && option.isCorrect && 'text-success', showResult && isSelected && !option.isCorrect && 'text-danger', showResult && !isSelected && option.isCorrect && 'text-success/70', !showResult && 'text-foreground')}>{option.text}</AppText>
                          {showResult && option.technique && (
                            <View className="mt-2 flex-row items-center gap-2">
                              <View className={cn('px-2 py-0.5 rounded-full', option.isCorrect ? 'bg-success/15' : 'bg-danger/15')}>
                                <AppText className={cn('text-xs', option.isCorrect ? 'text-success' : 'text-danger')}>{option.technique}</AppText>
                              </View>
                              {option.points > 0 && <AppText className="text-success text-xs font-medium">+{option.points} pts</AppText>}
                            </View>
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </Animated.View>
          );
        })}
      </View>
      {!isAnswered && (
        <View className="flex-row justify-center gap-1.5 mt-2">
          {turns.map((_: any, idx: number) => (
            <View key={idx} className={cn('w-2 h-2 rounded-full', idx < currentTurnIndex && 'bg-success', idx === currentTurnIndex && 'bg-accent w-4', idx > currentTurnIndex && 'bg-default')} />
          ))}
        </View>
      )}
    </View>
  );
}

// ============================================
// MAIN TRANSFER SCREEN COMPONENT
// ============================================
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [freeTextAnswer, setFreeTextAnswer] = useState('');

  // New question type states
  const [swipeCardIndex, setSwipeCardIndex] = useState(0);
  const [swipeAnswers, setSwipeAnswers] = useState<Record<string, 'left' | 'right'>>({});
  const [sentenceSelections, setSentenceSelections] = useState<Record<string, string>>({});
  const [activeBlankId, setActiveBlankId] = useState<string | null>(null);
  const [strategySelections, setStrategySelections] = useState<string[]>([]);
  const [dialogueTurnIndex, setDialogueTurnIndex] = useState(0);
  const [dialogueAnswers, setDialogueAnswers] = useState<Record<string, string>>({});
  const [dialoguePoints, setDialoguePoints] = useState(0);

  useEffect(() => {
    const firstUnanswered = questions.findIndex((q: any) => !answeredQuestions[q.id]);
    if (firstUnanswered !== -1) {
      setCurrentIndex(firstUnanswered);
    }
  }, []);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isAnswered = currentQuestion && answeredQuestions[currentQuestion.id];

  useEffect(() => {
    setMatchingAnswers({});
    setFreeTextAnswer('');
    setSwipeCardIndex(0);
    setSwipeAnswers({});
    setSentenceSelections({});
    setActiveBlankId(null);
    setStrategySelections([]);
    setDialogueTurnIndex(0);
    setDialogueAnswers({});
    setDialoguePoints(0);
  }, [currentIndex]);

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;
    const isCorrect = currentQuestion.correctAnswer === optionId;
    onAnswer(currentQuestion.id, optionId, isCorrect, isCorrect ? currentQuestion.points : 0);
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    }
  };

  const handleMatchingSelect = (itemId: string, matchValue: string) => {
    if (answeredQuestions[currentQuestion.id]) return;
    setMatchingAnswers((prev) => ({ ...prev, [itemId]: matchValue }));
  };

  const handleMatchingSubmit = () => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;
    const items = currentQuestion.items || [];
    let correctCount = 0;
    items.forEach((item: any) => {
      if (matchingAnswers[item.id] === item.match) correctCount++;
    });
    const isCorrect = correctCount === items.length;
    const partialPoints = Math.round((correctCount / items.length) * currentQuestion.points);
    onAnswer(currentQuestion.id, JSON.stringify(matchingAnswers), isCorrect, isCorrect ? currentQuestion.points : partialPoints);
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    }
  };

  const handleFreeTextSubmit = () => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;
    const wordCount = countWords(freeTextAnswer);
    const meetsMinWords = wordCount >= (currentQuestion.minWords || 0);
    const meetsMaxWords = wordCount <= (currentQuestion.maxWords || 999);
    const isCorrect = meetsMinWords && meetsMaxWords;
    onAnswer(currentQuestion.id, freeTextAnswer, isCorrect, isCorrect ? currentQuestion.points : 0);
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    }
  };

  // Swipe classifier handler
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;
    const cards = currentQuestion.cards || [];
    const currentCard = cards[swipeCardIndex];
    if (!currentCard) return;
    const newAnswers = { ...swipeAnswers, [currentCard.id]: direction };
    setSwipeAnswers(newAnswers);
    if (swipeCardIndex < cards.length - 1) {
      setSwipeCardIndex(swipeCardIndex + 1);
    } else {
      let correctCount = 0;
      cards.forEach((card: any) => {
        if (newAnswers[card.id] === card.correctAnswer) correctCount++;
      });
      const scoring = currentQuestion.scoring || {};
      let points = 0;
      if (correctCount >= (scoring.perfect?.count || cards.length)) points = scoring.perfect?.points || currentQuestion.points;
      else if (correctCount >= (scoring.good?.count || cards.length - 1)) points = scoring.good?.points || Math.round(currentQuestion.points * 0.8);
      else if (correctCount >= (scoring.partial?.count || cards.length - 2)) points = scoring.partial?.points || Math.round(currentQuestion.points * 0.6);
      const isCorrect = correctCount === cards.length;
      onAnswer(currentQuestion.id, JSON.stringify(newAnswers), isCorrect, points);
      if (currentIndex < totalQuestions - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
      }
    }
  }, [currentQuestion, swipeCardIndex, swipeAnswers, answeredQuestions, currentIndex, totalQuestions, onAnswer]);

  // Sentence builder handlers
  const handleSentenceBlankSelect = (blankId: string, wordText: string) => {
    if (answeredQuestions[currentQuestion?.id]) return;
    setSentenceSelections(prev => ({ ...prev, [blankId]: wordText }));
    setActiveBlankId(null);
  };

  const handleSentenceBuilderSubmit = () => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;
    const blanks = currentQuestion.blanks || [];
    let correctCount = 0;
    blanks.forEach((blank: any) => {
      if (blank.correctAnswers?.includes(sentenceSelections[blank.id])) correctCount++;
    });
    const scoring = currentQuestion.scoring || {};
    let points = 0;
    if (correctCount >= (scoring.perfect?.count || blanks.length)) points = scoring.perfect?.points || currentQuestion.points;
    else if (correctCount >= (scoring.good?.count || blanks.length - 1)) points = scoring.good?.points || Math.round(currentQuestion.points * 0.8);
    else if (correctCount >= (scoring.partial?.count || blanks.length - 2)) points = scoring.partial?.points || Math.round(currentQuestion.points * 0.6);
    else if (correctCount >= (scoring.low?.count || 0)) points = scoring.low?.points || Math.round(currentQuestion.points * 0.4);
    const isCorrect = correctCount === blanks.length;
    onAnswer(currentQuestion.id, JSON.stringify(sentenceSelections), isCorrect, points);
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    }
  };

  // Strategy builder handlers
  const handleStrategyToggle = (elementId: string) => {
    if (answeredQuestions[currentQuestion?.id]) return;
    const selectCount = currentQuestion?.selectCount || 4;
    setStrategySelections(prev => {
      if (prev.includes(elementId)) return prev.filter(id => id !== elementId);
      if (prev.length < selectCount) return [...prev, elementId];
      return prev;
    });
  };

  const handleStrategySubmit = () => {
    if (!currentQuestion || answeredQuestions[currentQuestion.id]) return;
    const elements = currentQuestion.elements || [];
    const correctElements = elements.filter((e: any) => e.isCorrect).map((e: any) => e.id);
    const allCorrect = strategySelections.every((id: string) => correctElements.includes(id));
    const hasAllCorrect = correctElements.every((id: string) => strategySelections.includes(id));
    const isCorrect = allCorrect && hasAllCorrect;
    const correctSelected = strategySelections.filter((id: string) => correctElements.includes(id)).length;
    const partialPoints = Math.round((correctSelected / correctElements.length) * currentQuestion.points);
    onAnswer(currentQuestion.id, strategySelections.join(','), isCorrect, isCorrect ? currentQuestion.points : partialPoints);
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
    }
  };

  // Dialogue simulator handlers
  const handleDialogueChoice = (turnId: string, optionId: string, points: number, isCorrectOption: boolean) => {
    if (answeredQuestions[currentQuestion?.id]) return;
    const newAnswers = { ...dialogueAnswers, [turnId]: optionId };
    setDialogueAnswers(newAnswers);
    const newPoints = dialoguePoints + points;
    setDialoguePoints(newPoints);
    const turns = currentQuestion?.turns || [];
    if (dialogueTurnIndex < turns.length - 1) {
      setTimeout(() => setDialogueTurnIndex(dialogueTurnIndex + 1), 800);
    } else {
      const maxPoints = turns.reduce((acc: number, turn: any) => acc + Math.max(...turn.options.map((o: any) => o.points || 0)), 0);
      const isCorrect = newPoints >= maxPoints;
      onAnswer(currentQuestion.id, JSON.stringify(newAnswers), isCorrect, newPoints);
      if (currentIndex < totalQuestions - 1) {
        setTimeout(() => setCurrentIndex(currentIndex + 1), 1500);
      }
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
    <ScrollView className="flex-1" contentContainerClassName="px-5 py-4" showsVerticalScrollIndicator={false}>
      {/* Apply Section Header */}
      <Animated.View entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))} className="mb-4">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-8 h-8 rounded-full bg-accent/15 items-center justify-center">
            <StyledFeather name="zap" size={16} className="text-accent" />
          </View>
          <AppText className="text-accent text-sm font-semibold uppercase">Apply Your Knowledge</AppText>
        </View>
        {screen.context && <AppText className="text-muted leading-5">{screen.context}</AppText>}
      </Animated.View>

      {/* Scenario Card */}
      {(scenario.title || scenario.details?.length > 0) && (
        <Animated.View entering={FadeInDown.duration(400).delay(100).easing(Easing.out(Easing.ease))} className="mb-6">
          <Card>
            <Card.Body className="p-4">
              {scenario.title && <AppText className="text-foreground font-semibold text-lg mb-3">{scenario.title}</AppText>}
              {scenario.details?.length > 0 && (
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
        <AppText className="text-muted text-sm">Question {currentIndex + 1} of {totalQuestions}</AppText>
        <AppText className="text-accent text-sm font-medium">{currentQuestion.points} pts</AppText>
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
      <AppText className="text-foreground font-semibold text-lg mb-4">{currentQuestion.question}</AppText>

      {/* Single Choice */}
      {currentQuestion.type === 'single_choice' && currentQuestion.options && (
        <View className="gap-3">
          {currentQuestion.options.map((option: any) => {
            const isSelected = answeredQuestions[currentQuestion.id]?.answer === option.id;
            const isCorrectOption = currentQuestion.correctAnswer === option.id;
            const showResult = isAnswered;
            return (
              <Pressable key={option.id} onPress={() => handleSelectOption(option.id)} disabled={!!isAnswered}>
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
                    <View className={cn('w-10 h-10 rounded-full items-center justify-center', !showResult && 'bg-default', showResult && isCorrectOption && 'bg-success', showResult && isSelected && !isCorrectOption && 'bg-danger')}>
                      {showResult && isCorrectOption ? (
                        <StyledFeather name="check" size={20} className="text-white" />
                      ) : showResult && isSelected && !isCorrectOption ? (
                        <StyledFeather name="x" size={20} className="text-white" />
                      ) : (
                        <AppText className="text-muted font-semibold">{option.id.toUpperCase()}</AppText>
                      )}
                    </View>
                    <AppText className={cn('flex-1 text-base', showResult && isCorrectOption && 'text-success font-medium', showResult && isSelected && !isCorrectOption && 'text-danger', !showResult && 'text-foreground')}>{option.text}</AppText>
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
                <View className={cn('px-4 py-3 rounded-xl', showResult && isCorrectMatch && 'bg-success/15', showResult && !isCorrectMatch && 'bg-danger/15', !showResult && 'bg-accent/15')}>
                  <AppText className={cn('font-semibold', showResult && isCorrectMatch && 'text-success', showResult && !isCorrectMatch && 'text-danger', !showResult && 'text-accent')}>{item.label}</AppText>
                </View>
                <Pressable
                  onPress={() => {
                    const allMatches = currentQuestion.items.map((i: any) => i.match);
                    const currentIdx = selectedMatch ? allMatches.indexOf(selectedMatch) : -1;
                    handleMatchingSelect(item.id, allMatches[(currentIdx + 1) % allMatches.length]);
                  }}
                  disabled={!!isAnswered}
                >
                  <View className={cn('px-4 py-3 rounded-xl border-2 flex-row items-center justify-between', !showResult && 'border-divider bg-content1', showResult && isCorrectMatch && 'border-success bg-success/10', showResult && !isCorrectMatch && 'border-danger bg-danger/10')}>
                    <AppText className={cn('flex-1', !selectedMatch && 'text-muted', showResult && isCorrectMatch && 'text-success', showResult && !isCorrectMatch && 'text-danger')} numberOfLines={2}>{selectedMatch || 'Tap to select...'}</AppText>
                    {!isAnswered && <StyledFeather name="chevron-down" size={18} className="text-muted" />}
                    {showResult && isCorrectMatch && <StyledFeather name="check" size={18} className="text-success" />}
                    {showResult && !isCorrectMatch && <StyledFeather name="x" size={18} className="text-danger" />}
                  </View>
                </Pressable>
                {showResult && !isCorrectMatch && <AppText className="text-success text-sm ml-2">Correct: {item.match}</AppText>}
              </View>
            );
          })}
          {!isAnswered && (
            <Pressable className={cn('mt-4 py-4 rounded-xl items-center justify-center', Object.keys(matchingAnswers).length < currentQuestion.items.length ? 'bg-default/30' : 'bg-accent active:opacity-80')} onPress={handleMatchingSubmit} disabled={Object.keys(matchingAnswers).length < currentQuestion.items.length}>
              <AppText className={cn('font-semibold', Object.keys(matchingAnswers).length < currentQuestion.items.length ? 'text-muted' : 'text-white')}>Submit Answer</AppText>
            </Pressable>
          )}
        </View>
      )}

      {/* Free Text Question */}
      {currentQuestion.type === 'free_text' && (
        <View className="gap-4">
          <View>
            <AppText className="text-muted text-sm mb-2">Your Answer ({currentQuestion.minWords}-{currentQuestion.maxWords} words)</AppText>
            <TextInput placeholder="Type your answer here..." value={freeTextAnswer} onChangeText={setFreeTextAnswer} multiline numberOfLines={6} editable={!isAnswered} className="p-4 rounded-2xl border-2 border-divider bg-content1 text-foreground min-h-[150px] text-base" placeholderTextColor="#999" textAlignVertical="top" />
          </View>
          <View className="flex-row justify-between">
            <AppText className={cn('text-sm', countWords(freeTextAnswer) < (currentQuestion.minWords || 0) ? 'text-danger' : countWords(freeTextAnswer) > (currentQuestion.maxWords || 999) ? 'text-danger' : 'text-success')}>{countWords(freeTextAnswer)} / {currentQuestion.minWords}-{currentQuestion.maxWords} words</AppText>
          </View>
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
          {!isAnswered && (
            <Pressable className={cn('mt-4 py-4 rounded-xl items-center justify-center', countWords(freeTextAnswer) < (currentQuestion.minWords || 0) ? 'bg-default/30' : 'bg-accent active:opacity-80')} onPress={handleFreeTextSubmit} disabled={countWords(freeTextAnswer) < (currentQuestion.minWords || 0)}>
              <AppText className={cn('font-semibold', countWords(freeTextAnswer) < (currentQuestion.minWords || 0) ? 'text-muted' : 'text-white')}>Submit Answer</AppText>
            </Pressable>
          )}
          {isAnswered && currentQuestion.modelAnswer && (
            <View className="mt-4 p-4 rounded-2xl bg-success/10">
              <AppText className="text-success font-semibold mb-2">Model Answer:</AppText>
              <AppText className="text-foreground leading-5">{currentQuestion.modelAnswer}</AppText>
            </View>
          )}
        </View>
      )}

      {/* Swipe Classifier Question */}
      {currentQuestion.type === 'swipe_classifier' && (
        <SwipeClassifierQuestion question={currentQuestion} swipeCardIndex={swipeCardIndex} swipeAnswers={swipeAnswers} isAnswered={!!isAnswered} onSwipe={handleSwipe} />
      )}

      {/* Sentence Builder Question */}
      {currentQuestion.type === 'sentence_builder' && (
        <SentenceBuilderQuestion question={currentQuestion} selections={sentenceSelections} activeBlankId={activeBlankId} isAnswered={!!isAnswered} onBlankPress={setActiveBlankId} onWordSelect={handleSentenceBlankSelect} onSubmit={handleSentenceBuilderSubmit} />
      )}

      {/* Strategy Builder Question */}
      {currentQuestion.type === 'strategy_builder' && (
        <StrategyBuilderQuestion question={currentQuestion} selections={strategySelections} isAnswered={!!isAnswered} onToggle={handleStrategyToggle} onSubmit={handleStrategySubmit} />
      )}

      {/* Dialogue Simulator Question */}
      {currentQuestion.type === 'dialogue_simulator' && (
        <DialogueSimulatorQuestion question={currentQuestion} currentTurnIndex={dialogueTurnIndex} answers={dialogueAnswers} totalPoints={dialoguePoints} isAnswered={!!isAnswered} onChoice={handleDialogueChoice} />
      )}

      {/* Feedback */}
      {isAnswered && currentQuestion.feedback && (
        <Animated.View entering={FadeInUp.duration(400).easing(Easing.out(Easing.ease))} className="mt-6">
          <View className={cn('p-4 rounded-2xl', answeredQuestions[currentQuestion.id].isCorrect ? 'bg-success/15' : 'bg-danger/15')}>
            <View className="flex-row items-start gap-3">
              <View className={cn('w-10 h-10 rounded-full items-center justify-center', answeredQuestions[currentQuestion.id].isCorrect ? 'bg-success/20' : 'bg-danger/20')}>
                {answeredQuestions[currentQuestion.id].isCorrect ? <StyledFeather name="check-circle" size={20} className="text-success" /> : <StyledFeather name="info" size={20} className="text-danger" />}
              </View>
              <View className="flex-1">
                <AppText className={cn('font-semibold mb-1', answeredQuestions[currentQuestion.id].isCorrect ? 'text-success' : 'text-danger')}>{answeredQuestions[currentQuestion.id].isCorrect ? 'Correct!' : 'Not quite'}</AppText>
                <AppText className={cn('leading-5', answeredQuestions[currentQuestion.id].isCorrect ? 'text-success/80' : 'text-foreground')}>{answeredQuestions[currentQuestion.id].isCorrect ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect}</AppText>
              </View>
            </View>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}
