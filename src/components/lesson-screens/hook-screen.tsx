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

interface HookScreenProps {
  screen: any;
  onContinue: () => void;
}

export function HookScreen({ screen, onContinue }: HookScreenProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 py-6"
      showsVerticalScrollIndicator={false}
    >
      {/* Headline */}
      {screen.headline && (
        <Animated.View
          entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))}
          className="mb-6"
        >
          <AppText className="text-foreground text-2xl font-bold text-center leading-8">
            {screen.headline}
          </AppText>
        </Animated.View>
      )}

      {/* Visual - Failed Projects */}
      {screen.visual?.type === 'split_screen' && screen.visual?.items && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(100).easing(Easing.out(Easing.ease))}
          className="mb-6"
        >
          {screen.visual.items.map((item: any, index: number) => (
            <Card key={index} className="mb-3">
              <Card.Body className="p-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-danger/15 items-center justify-center">
                    <StyledFeather name="x" size={20} className="text-danger" />
                  </View>
                  <View className="flex-1">
                    <AppText className="text-foreground font-semibold">{item.title}</AppText>
                    <AppText className="text-muted text-sm mt-0.5">{item.details}</AppText>
                  </View>
                </View>
              </Card.Body>
            </Card>
          ))}
        </Animated.View>
      )}

      {/* Character Dialogue */}
      {screen.dialogue && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(200).easing(Easing.out(Easing.ease))}
          className="mb-6"
        >
          <Card>
            <Card.Body className="p-4">
              <View className="flex-row items-start gap-3">
                <View className="w-12 h-12 rounded-full bg-accent/15 items-center justify-center">
                  <AppText className="text-2xl">
                    {characterEmojis[screen.dialogue.character] || '👤'}
                  </AppText>
                </View>
                <View className="flex-1">
                  <AppText className="text-accent text-xs font-semibold uppercase mb-1">
                    {screen.dialogue.character}
                  </AppText>
                  <AppText className="text-foreground leading-6 text-base">
                    "{screen.dialogue.text}"
                  </AppText>
                </View>
              </View>
            </Card.Body>
          </Card>
        </Animated.View>
      )}

      {/* Learning Hook */}
      {screen.learningHook && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(300).easing(Easing.out(Easing.ease))}
          className="mb-6"
        >
          <View className="bg-accent/10 rounded-2xl p-4">
            <View className="flex-row items-start gap-3">
              <View className="w-8 h-8 rounded-full bg-accent/20 items-center justify-center">
                <AppText className="text-lg">💡</AppText>
              </View>
              <AppText className="text-accent font-medium leading-6 flex-1">
                {screen.learningHook}
              </AppText>
            </View>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  );
}
