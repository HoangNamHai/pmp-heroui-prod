import { StatusBar } from 'expo-status-bar';
import { Card, cn } from 'heroui-native';
import { View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { useAppTheme } from '../../../contexts/app-theme-context';

interface ResultItem {
  id: string;
  title: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  date: string;
  duration: string;
}

const allResults: ResultItem[] = [
  {
    id: '1',
    title: 'Quick Quiz',
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    date: 'Today',
    duration: '4 min',
  },
  {
    id: '2',
    title: 'People Domain',
    score: 72,
    totalQuestions: 20,
    correctAnswers: 14,
    date: 'Yesterday',
    duration: '12 min',
  },
  {
    id: '3',
    title: 'Quick Quiz',
    score: 90,
    totalQuestions: 10,
    correctAnswers: 9,
    date: '2 days ago',
    duration: '5 min',
  },
  {
    id: '4',
    title: 'Process Domain',
    score: 68,
    totalQuestions: 25,
    correctAnswers: 17,
    date: '3 days ago',
    duration: '18 min',
  },
  {
    id: '5',
    title: 'Quick Quiz',
    score: 80,
    totalQuestions: 10,
    correctAnswers: 8,
    date: '5 days ago',
    duration: '6 min',
  },
  {
    id: '6',
    title: 'People Domain',
    score: 95,
    totalQuestions: 20,
    correctAnswers: 19,
    date: '1 week ago',
    duration: '14 min',
  },
];

function ResultCard({ item, index }: { item: ResultItem; index: number }) {
  const scoreColor = item.score >= 80 ? 'text-success' : item.score >= 60 ? 'text-warning' : 'text-danger';

  return (
    <Animated.View
      entering={FadeInDown.duration(300)
        .delay(index * 80)
        .easing(Easing.out(Easing.ease))}
    >
      <Card className="mb-3">
        <Card.Body className="py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <AppText className="text-foreground font-semibold text-base">
                {item.title}
              </AppText>
              <AppText className="text-muted text-sm mt-0.5">
                {item.date} • {item.duration}
              </AppText>
            </View>
            <View className="items-end">
              <AppText className={cn('text-2xl font-bold', scoreColor)}>
                {item.score}%
              </AppText>
              <AppText className="text-muted text-xs">
                {item.correctAnswers}/{item.totalQuestions} correct
              </AppText>
            </View>
          </View>
        </Card.Body>
      </Card>
    </Animated.View>
  );
}

export default function ResultsScreen() {
  const { isDark } = useAppTheme();

  return (
    <ScreenScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View className="pt-4 pb-4">
        <AppText className="text-muted text-sm">
          Track your progress and review past quiz results
        </AppText>
      </View>

      {allResults.map((item, index) => (
        <ResultCard key={item.id} item={item} index={index} />
      ))}
    </ScreenScrollView>
  );
}
