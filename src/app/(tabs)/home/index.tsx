import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'expo-status-bar';
import { Card, cn } from 'heroui-native';
import { Image, Pressable, View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { useAppTheme } from '../../../contexts/app-theme-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const StyledFeather = withUniwind(Feather);

export default function HomeScreen() {
  const { isDark } = useAppTheme();

  return (
    <ScreenScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View className="items-center justify-center pt-4 pb-2">
        <AppText className="text-accent text-2xl font-bold">
          F&B Tycoon
        </AppText>
        <AppText className="text-muted text-sm">
          Project Management Tycoon
        </AppText>
      </View>

      {/* Daily Streak Card */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(100).easing(Easing.out(Easing.ease))}
      >
        <Card className="mb-4">
          <Card.Body className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center">
                <AppText className="text-2xl">🔥</AppText>
              </View>
              <View>
                <AppText className="text-foreground font-semibold text-lg">
                  Daily Streak
                </AppText>
                <AppText className="text-muted text-sm">
                  Keep learning every day!
                </AppText>
              </View>
            </View>
            <View className="items-end">
              <AppText className="text-accent text-3xl font-bold">5</AppText>
              <AppText className="text-muted text-xs">days</AppText>
            </View>
          </Card.Body>
        </Card>
      </Animated.View>

      {/* Continue Learning Card */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(200).easing(Easing.out(Easing.ease))}
      >
        <AnimatedPressable>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title className="text-foreground">Continue Learning</Card.Title>
            </Card.Header>
            <Card.Body className="gap-3">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg bg-accent/20 items-center justify-center">
                  <AppText className="text-lg">📖</AppText>
                </View>
                <View className="flex-1">
                  <AppText className="text-foreground font-medium">
                    B2L3: Stakeholder Management
                  </AppText>
                  <AppText className="text-muted text-sm">
                    People Domain
                  </AppText>
                </View>
              </View>

              {/* Progress Bar */}
              <View className="gap-1">
                <View className="flex-row justify-between">
                  <AppText className="text-muted text-xs">Progress</AppText>
                  <AppText className="text-accent text-xs font-medium">65%</AppText>
                </View>
                <View className="h-2 rounded-full bg-default overflow-hidden">
                  <View
                    className="h-full rounded-full bg-accent"
                    style={{ width: '65%' }}
                  />
                </View>
              </View>
            </Card.Body>
            <Card.Footer className="flex-row justify-end">
              <View className="flex-row items-center gap-1">
                <AppText className="text-accent font-medium">Continue</AppText>
                <StyledFeather name="arrow-right" size={16} className="text-accent" />
              </View>
            </Card.Footer>
          </Card>
        </AnimatedPressable>
      </Animated.View>

      {/* Today's Goal Card */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(300).easing(Easing.out(Easing.ease))}
      >
        <Card className="mb-4">
          <Card.Header>
            <Card.Title className="text-foreground">Today's Goal</Card.Title>
            <Card.Description className="text-muted">
              Complete 5 lessons to reach your daily target
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <View className="flex-row items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  className={cn(
                    'w-10 h-10 rounded-full items-center justify-center',
                    i === 1 ? 'bg-success' : 'bg-default'
                  )}
                >
                  {i === 1 ? (
                    <StyledFeather name="check" size={20} className="text-white" />
                  ) : (
                    <AppText className="text-muted">{i}</AppText>
                  )}
                </View>
              ))}
            </View>
            <View className="items-center mt-3">
              <AppText className="text-muted text-sm">1 of 5 completed</AppText>
            </View>
          </Card.Body>
        </Card>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(400).easing(Easing.out(Easing.ease))}
      >
        <AppText className="text-foreground font-semibold text-lg mb-3">
          Quick Actions
        </AppText>
        <View className="flex-row gap-3">
          <Pressable className="flex-1">
            <Card className="items-center py-4">
              <View className="w-12 h-12 rounded-full bg-success/20 items-center justify-center mb-2">
                <StyledFeather name="play" size={24} className="text-success" />
              </View>
              <AppText className="text-foreground font-medium text-center">
                Practice Quiz
              </AppText>
            </Card>
          </Pressable>
          <Pressable className="flex-1">
            <Card className="items-center py-4">
              <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mb-2">
                <StyledFeather name="target" size={24} className="text-accent" />
              </View>
              <AppText className="text-foreground font-medium text-center">
                Mock Exam
              </AppText>
            </Card>
          </Pressable>
        </View>
      </Animated.View>
    </ScreenScrollView>
  );
}
