import Feather from '@expo/vector-icons/Feather';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { cn, useThemeColor } from 'heroui-native';
import { forwardRef, useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../app-text';
import { useSettings } from '../../contexts/settings-context';

const StyledFeather = withUniwind(Feather);

const GOAL_OPTIONS = [
  { value: 1, label: '1 lesson', description: 'Light learning' },
  { value: 3, label: '3 lessons', description: 'Casual pace' },
  { value: 5, label: '5 lessons', description: 'Recommended' },
  { value: 7, label: '7 lessons', description: 'Serious learner' },
  { value: 10, label: '10 lessons', description: 'Intensive' },
];

interface DailyGoalSheetProps {
  onClose?: () => void;
}

export const DailyGoalSheet = forwardRef<BottomSheet, DailyGoalSheetProps>(
  ({ onClose }, ref) => {
    const insets = useSafeAreaInsets();
    const { dailyGoal, setDailyGoal } = useSettings();

    const backgroundColor = useThemeColor('background');
    const handleIndicatorColor = useThemeColor('muted');

    const snapPoints = useMemo(() => ['55%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    const handleSelect = (value: number) => {
      setDailyGoal(value);
      onClose?.();
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: handleIndicatorColor }}
        onClose={onClose}
      >
        <BottomSheetView
          style={{ flex: 1, paddingBottom: insets.bottom + 16 }}
        >
          <View className="px-5">
            {/* Header */}
            <View className="items-center mb-6">
              <View className="w-14 h-14 rounded-full bg-accent/15 items-center justify-center mb-3">
                <StyledFeather name="target" size={28} className="text-accent" />
              </View>
              <AppText className="text-foreground text-xl font-bold">
                Daily Goal
              </AppText>
              <AppText className="text-muted text-center mt-1">
                How many lessons do you want to complete each day?
              </AppText>
            </View>

            {/* Options */}
            <View className="gap-2">
              {GOAL_OPTIONS.map((option) => {
                const isSelected = dailyGoal === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    className="active:opacity-80"
                  >
                    <View
                      className={cn(
                        'flex-row items-center p-4 rounded-2xl border-2',
                        isSelected
                          ? 'border-accent bg-accent/10'
                          : 'border-divider bg-content1'
                      )}
                    >
                      <View className="flex-1">
                        <AppText
                          className={cn(
                            'font-semibold text-base',
                            isSelected ? 'text-accent' : 'text-foreground'
                          )}
                        >
                          {option.label}
                        </AppText>
                        <AppText className="text-muted text-sm">
                          {option.description}
                        </AppText>
                      </View>
                      {isSelected && (
                        <View className="w-8 h-8 rounded-full bg-accent items-center justify-center">
                          <StyledFeather name="check" size={18} className="text-white" />
                        </View>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

DailyGoalSheet.displayName = 'DailyGoalSheet';
