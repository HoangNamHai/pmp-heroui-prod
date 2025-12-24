import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Card, cn } from 'heroui-native';
import { Alert, Pressable, View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { useAppTheme } from '../../../contexts/app-theme-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledFeather = withUniwind(Feather);

interface PracticeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  questionCount: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isNew?: boolean;
}

const practiceItems: PracticeItem[] = [
  {
    id: 'quick-quiz',
    title: 'Quick Quiz',
    description: '10 random questions from all domains',
    icon: '⚡',
    questionCount: 10,
    duration: '5 min',
    difficulty: 'Easy',
    isNew: true,
  },
  {
    id: 'people-quiz',
    title: 'People Domain Quiz',
    description: 'Focus on team and stakeholder management',
    icon: '👥',
    questionCount: 20,
    duration: '15 min',
    difficulty: 'Medium',
  },
  {
    id: 'process-quiz',
    title: 'Process Domain Quiz',
    description: 'Planning, execution, and monitoring',
    icon: '⚙️',
    questionCount: 25,
    duration: '20 min',
    difficulty: 'Medium',
  },
  {
    id: 'mock-exam',
    title: 'Full Mock Exam',
    description: 'Simulate the real PMP exam experience',
    icon: '📝',
    questionCount: 180,
    duration: '230 min',
    difficulty: 'Hard',
  },
];

const recentResults = [
  { title: 'Quick Quiz', score: 85, date: 'Today' },
  { title: 'People Domain', score: 72, date: 'Yesterday' },
  { title: 'Quick Quiz', score: 90, date: '2 days ago' },
];

function PracticeCard({ item, index, onPress }: { item: PracticeItem; index: number; onPress: () => void }) {
  const difficultyColor = {
    Easy: 'text-success',
    Medium: 'text-warning',
    Hard: 'text-danger',
  }[item.difficulty];

  return (
    <AnimatedPressable
      onPress={onPress}
      entering={FadeInDown.duration(300)
        .delay(index * 100)
        .easing(Easing.out(Easing.ease))}
    >
      <Card className="mb-3">
        <Card.Body className="gap-3 py-4">
          <View className="flex-row items-start gap-3">
            <View className="w-12 h-12 rounded-xl bg-accent/20 items-center justify-center">
              <AppText className="text-2xl">{item.icon}</AppText>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <AppText className="text-foreground font-semibold text-base">
                  {item.title}
                </AppText>
                {item.isNew && (
                  <View className="bg-accent px-2 py-0.5 rounded-full">
                    <AppText className="text-white text-xs font-medium">NEW</AppText>
                  </View>
                )}
              </View>
              <AppText className="text-muted text-sm mt-0.5">
                {item.description}
              </AppText>
            </View>
          </View>

          <View className="flex-row items-center justify-between pt-2 border-t border-divider">
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <StyledFeather name="help-circle" size={14} className="text-muted" />
                <AppText className="text-muted text-sm">
                  {item.questionCount} questions
                </AppText>
              </View>
              <View className="flex-row items-center gap-1">
                <StyledFeather name="clock" size={14} className="text-muted" />
                <AppText className="text-muted text-sm">{item.duration}</AppText>
              </View>
            </View>
            <AppText className={cn('text-sm font-medium', difficultyColor)}>
              {item.difficulty}
            </AppText>
          </View>
        </Card.Body>
      </Card>
    </AnimatedPressable>
  );
}

export default function PracticesScreen() {
  const { isDark } = useAppTheme();
  const router = useRouter();

  return (
    <ScreenScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View className="pt-4 pb-6">
        <AppText className="text-foreground text-2xl font-bold">
          Practice
        </AppText>
        <AppText className="text-muted text-sm mt-1">
          Test your knowledge with quizzes and mock exams
        </AppText>
      </View>

      {/* Recent Results */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <AppText className="text-foreground font-semibold text-lg">
            Recent Results
          </AppText>
          <Pressable onPress={() => router.push('/practices/results')}>
            <AppText className="text-accent text-sm font-medium">See All</AppText>
          </Pressable>
        </View>
        <View className="flex-row gap-2">
          {recentResults.map((result, index) => (
            <View key={index} className="flex-1">
              <Card>
                <Card.Body className="py-3 items-center">
                  <AppText
                    className={cn(
                      'text-xl font-bold',
                      result.score >= 80 ? 'text-success' : 'text-warning'
                    )}
                  >
                    {result.score}%
                  </AppText>
                  <AppText className="text-foreground text-xs font-medium mt-1" numberOfLines={1}>
                    {result.title}
                  </AppText>
                  <AppText className="text-muted text-xs">{result.date}</AppText>
                </Card.Body>
              </Card>
            </View>
          ))}
        </View>
      </View>

      {/* Practice Options */}
      <AppText className="text-foreground font-semibold text-lg mb-3">
        Available Practices
      </AppText>

      {practiceItems.map((item, index) => (
        <PracticeCard
          key={item.id}
          item={item}
          index={index}
          onPress={() => {
            Alert.alert(
              item.title,
              `Start ${item.questionCount} questions quiz (${item.duration})?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Start Quiz', onPress: () => Alert.alert('Coming Soon', 'Practice quizzes will be available in the next update!') }
              ]
            );
          }}
        />
      ))}
    </ScreenScrollView>
  );
}
