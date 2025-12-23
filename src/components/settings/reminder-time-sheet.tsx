import Feather from '@expo/vector-icons/Feather';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { cn, useThemeColor } from 'heroui-native';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { AppText } from '../app-text';
import { useSettings } from '../../contexts/settings-context';

const StyledFeather = withUniwind(Feather);

// Generate time options
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

const formatTime = (hour: number, minute: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
};

interface ReminderTimeSheetProps {
  onClose?: () => void;
}

export const ReminderTimeSheet = forwardRef<BottomSheet, ReminderTimeSheetProps>(
  ({ onClose }, ref) => {
    const insets = useSafeAreaInsets();
    const { reminderTime, setReminderTime } = useSettings();
    const [selectedHour, setSelectedHour] = useState(reminderTime.hour);
    const [selectedMinute, setSelectedMinute] = useState(reminderTime.minute);

    const backgroundColor = useThemeColor('background');
    const handleIndicatorColor = useThemeColor('muted');

    const snapPoints = useMemo(() => ['60%'], []);

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

    const handleSave = () => {
      setReminderTime({ hour: selectedHour, minute: selectedMinute });
      onClose?.();
    };

    // Quick preset times
    const presets = [
      { label: 'Morning', hour: 8, minute: 0 },
      { label: 'Lunch', hour: 12, minute: 0 },
      { label: 'Evening', hour: 18, minute: 0 },
      { label: 'Night', hour: 21, minute: 0 },
    ];

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
          <View className="px-5 flex-1">
            {/* Header */}
            <View className="items-center mb-4">
              <View className="w-14 h-14 rounded-full bg-accent/15 items-center justify-center mb-3">
                <StyledFeather name="clock" size={28} className="text-accent" />
              </View>
              <AppText className="text-foreground text-xl font-bold">
                Reminder Time
              </AppText>
              <AppText className="text-muted text-center mt-1">
                When should we remind you to learn?
              </AppText>
            </View>

            {/* Selected Time Display */}
            <View className="items-center mb-4">
              <View className="bg-accent/10 px-6 py-3 rounded-2xl">
                <AppText className="text-accent text-3xl font-bold">
                  {formatTime(selectedHour, selectedMinute)}
                </AppText>
              </View>
            </View>

            {/* Quick Presets */}
            <View className="flex-row gap-2 mb-4">
              {presets.map((preset) => {
                const isSelected = selectedHour === preset.hour && selectedMinute === preset.minute;
                return (
                  <Pressable
                    key={preset.label}
                    onPress={() => {
                      setSelectedHour(preset.hour);
                      setSelectedMinute(preset.minute);
                    }}
                    className="flex-1"
                  >
                    <View
                      className={cn(
                        'py-2 rounded-xl items-center',
                        isSelected ? 'bg-accent' : 'bg-default/50'
                      )}
                    >
                      <AppText
                        className={cn(
                          'text-sm font-medium',
                          isSelected ? 'text-white' : 'text-foreground'
                        )}
                      >
                        {preset.label}
                      </AppText>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Time Picker */}
            <View className="flex-row gap-4 mb-4" style={{ height: 200 }}>
              {/* Hour Picker */}
              <View className="flex-1">
                <AppText className="text-muted text-xs uppercase tracking-wider mb-2 text-center">
                  Hour
                </AppText>
                <ScrollView
                  className="flex-1 bg-content1 rounded-xl"
                  showsVerticalScrollIndicator={false}
                >
                  {HOURS.map((hour) => {
                    const isSelected = selectedHour === hour;
                    return (
                      <Pressable
                        key={hour}
                        onPress={() => setSelectedHour(hour)}
                      >
                        <View
                          className={cn(
                            'py-3 items-center',
                            isSelected && 'bg-accent/15'
                          )}
                        >
                          <AppText
                            className={cn(
                              'text-lg',
                              isSelected ? 'text-accent font-bold' : 'text-foreground'
                            )}
                          >
                            {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                          </AppText>
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Minute Picker */}
              <View className="flex-1">
                <AppText className="text-muted text-xs uppercase tracking-wider mb-2 text-center">
                  Minute
                </AppText>
                <View className="flex-1 bg-content1 rounded-xl justify-center">
                  {MINUTES.map((minute) => {
                    const isSelected = selectedMinute === minute;
                    return (
                      <Pressable
                        key={minute}
                        onPress={() => setSelectedMinute(minute)}
                      >
                        <View
                          className={cn(
                            'py-3 items-center',
                            isSelected && 'bg-accent/15 rounded-lg mx-1'
                          )}
                        >
                          <AppText
                            className={cn(
                              'text-lg',
                              isSelected ? 'text-accent font-bold' : 'text-foreground'
                            )}
                          >
                            :{minute.toString().padStart(2, '0')}
                          </AppText>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              className="bg-accent py-4 rounded-xl items-center active:opacity-80"
            >
              <AppText className="text-white font-semibold text-base">
                Save Reminder Time
              </AppText>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

ReminderTimeSheet.displayName = 'ReminderTimeSheet';
