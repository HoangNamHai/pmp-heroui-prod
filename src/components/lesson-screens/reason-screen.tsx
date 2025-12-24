import Feather from '@expo/vector-icons/Feather';
import { Card, cn } from 'heroui-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown, Easing } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../app-text';

const StyledFeather = withUniwind(Feather);

interface ReasonScreenProps {
  screen: any;
}

function ContentBlock({ block, index }: { block: any; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 100).easing(Easing.out(Easing.ease))}
      className="mb-4"
    >
      <Pressable onPress={() => setExpanded(!expanded)}>
        <Card>
          <Card.Body className="p-4">
            {/* Block Header */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-8 h-8 rounded-full bg-accent/15 items-center justify-center">
                  <AppText className="text-accent font-bold text-sm">{index + 1}</AppText>
                </View>
                <AppText className="text-foreground font-semibold flex-1" numberOfLines={expanded ? undefined : 1}>
                  {block.title}
                </AppText>
              </View>
              <StyledFeather
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                className="text-muted"
              />
            </View>

            {/* Expanded Content */}
            {expanded && block.content && (
              <View className="mt-4 pt-4 border-t border-divider">
                {/* Definition */}
                {block.content.definition && (
                  <View className="bg-accent/10 rounded-xl p-3 mb-4">
                    <AppText className="text-accent font-medium leading-5">
                      {block.content.definition}
                    </AppText>
                  </View>
                )}

                {/* Key Points */}
                {block.content.keyPoints && (
                  <View className="mb-4">
                    {block.content.keyPoints.map((point: any, i: number) => (
                      <View key={i} className="flex-row items-start gap-3 mb-3">
                        <View className="w-6 h-6 rounded-full bg-success/15 items-center justify-center mt-0.5">
                          <StyledFeather name="check" size={12} className="text-success" />
                        </View>
                        <View className="flex-1">
                          <AppText className="text-foreground font-medium">{point.term}</AppText>
                          <AppText className="text-muted text-sm leading-5">{point.explanation}</AppText>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Characteristics */}
                {block.content.characteristics && (
                  <View className="mb-4">
                    {block.content.characteristics.map((char: string, i: number) => (
                      <View key={i} className="flex-row items-start gap-2 mb-2">
                        <View className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                        <AppText className="text-foreground flex-1 leading-5">{char}</AppText>
                      </View>
                    ))}
                  </View>
                )}

                {/* Constraints (for triple constraint) */}
                {block.content.constraints && (
                  <View className="mb-4">
                    {block.content.constraints.map((constraint: any, i: number) => (
                      <View key={i} className="bg-default/50 rounded-xl p-3 mb-2">
                        <AppText className="text-foreground font-semibold">{constraint.name}</AppText>
                        <AppText className="text-muted text-sm">{constraint.question}</AppText>
                        {constraint.example && (
                          <AppText className="text-accent text-sm mt-1">e.g., {constraint.example}</AppText>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* Components */}
                {block.content.components && (
                  <View className="mb-4">
                    {block.content.components.map((comp: any, i: number) => (
                      <View key={i} className="flex-row items-start gap-3 mb-3">
                        <View className="w-6 h-6 rounded-full bg-accent/15 items-center justify-center mt-0.5">
                          <StyledFeather name="layers" size={12} className="text-accent" />
                        </View>
                        <View className="flex-1">
                          <AppText className="text-foreground font-medium">{comp.name}</AppText>
                          <AppText className="text-muted text-sm leading-5">{comp.detail}</AppText>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Roles (stakeholder roles) */}
                {block.content.roles && (
                  <View className="mb-4 gap-3">
                    {block.content.roles.map((role: any, i: number) => (
                      <View key={i} className="bg-default/50 rounded-xl p-4">
                        <AppText className="text-accent font-bold mb-1">{role.name}</AppText>
                        <AppText className="text-foreground leading-5 mb-2">{role.definition}</AppText>
                        {role.authority && (
                          <View className="flex-row items-start gap-2 mb-1">
                            <AppText className="text-muted text-sm">Authority:</AppText>
                            <AppText className="text-foreground text-sm flex-1">{role.authority}</AppText>
                          </View>
                        )}
                        {role.example && (
                          <View className="flex-row items-start gap-2">
                            <AppText className="text-muted text-sm">Example:</AppText>
                            <AppText className="text-accent text-sm flex-1">{role.example}</AppText>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* Internal/External sections (stakeholders) */}
                {block.content.internal && (
                  <View className="mb-4">
                    <View className="bg-success/10 rounded-xl p-3 mb-3">
                      <AppText className="text-success font-semibold mb-1">Internal Stakeholders</AppText>
                      <AppText className="text-foreground text-sm mb-2">{block.content.internal.definition}</AppText>
                      {block.content.internal.examples?.map((ex: string, i: number) => (
                        <View key={i} className="flex-row items-start gap-2 mb-1">
                          <AppText className="text-success">•</AppText>
                          <AppText className="text-foreground text-sm flex-1">{ex}</AppText>
                        </View>
                      ))}
                    </View>
                    {block.content.external && (
                      <View className="bg-warning/10 rounded-xl p-3">
                        <AppText className="text-warning font-semibold mb-1">External Stakeholders</AppText>
                        <AppText className="text-foreground text-sm mb-2">{block.content.external.definition}</AppText>
                        {block.content.external.examples?.map((ex: string, i: number) => (
                          <View key={i} className="flex-row items-start gap-2 mb-1">
                            <AppText className="text-warning">•</AppText>
                            <AppText className="text-foreground text-sm flex-1">{ex}</AppText>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Consequences (cost of missing stakeholders) */}
                {block.content.consequences && (
                  <View className="mb-4 gap-2">
                    {block.content.consequences.map((item: any, i: number) => (
                      <View key={i} className="flex-row items-start gap-3 bg-danger/5 rounded-xl p-3">
                        <View className="w-6 h-6 rounded-full bg-danger/15 items-center justify-center mt-0.5">
                          <StyledFeather name="alert-triangle" size={12} className="text-danger" />
                        </View>
                        <View className="flex-1">
                          <AppText className="text-danger font-medium">{item.issue}</AppText>
                          <AppText className="text-muted text-sm leading-5">{item.cost}</AppText>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Techniques list */}
                {block.content.techniques && (
                  <View className="mb-4">
                    <AppText className="text-muted text-xs uppercase tracking-wider mb-2">Techniques</AppText>
                    {block.content.techniques.map((technique: string, i: number) => (
                      <View key={i} className="flex-row items-start gap-2 mb-2">
                        <View className="w-5 h-5 rounded-full bg-accent/15 items-center justify-center mt-0.5">
                          <AppText className="text-accent text-xs font-bold">{i + 1}</AppText>
                        </View>
                        <AppText className="text-foreground flex-1 leading-5">{technique}</AppText>
                      </View>
                    ))}
                  </View>
                )}

                {/* Questions list */}
                {block.content.questions && (
                  <View className="mb-4">
                    <AppText className="text-muted text-xs uppercase tracking-wider mb-2">Key Questions to Ask</AppText>
                    {block.content.questions.map((question: string, i: number) => (
                      <View key={i} className="flex-row items-start gap-2 mb-2">
                        <AppText className="text-accent">?</AppText>
                        <AppText className="text-foreground flex-1 leading-5">{question}</AppText>
                      </View>
                    ))}
                  </View>
                )}

                {/* Key Insights (different from insight) */}
                {block.content.keyInsights && (
                  <View className="mb-4">
                    {block.content.keyInsights.map((insight: string, i: number) => (
                      <View key={i} className="flex-row items-start gap-2 mb-2">
                        <View className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                        <AppText className="text-foreground flex-1 leading-5">{insight}</AppText>
                      </View>
                    ))}
                  </View>
                )}

                {/* Note */}
                {block.content.note && (
                  <View className="bg-default/30 rounded-xl p-3 mt-2">
                    <View className="flex-row items-start gap-2">
                      <AppText className="text-lg">📝</AppText>
                      <AppText className="text-muted flex-1 leading-5 text-sm italic">
                        {block.content.note}
                      </AppText>
                    </View>
                  </View>
                )}

                {/* Examples */}
                {block.content.examples && Array.isArray(block.content.examples) && (
                  <View className="mb-4">
                    <AppText className="text-muted text-xs uppercase tracking-wider mb-2">Examples</AppText>
                    {block.content.examples.map((ex: string, i: number) => (
                      <View key={i} className="flex-row items-start gap-2 mb-1.5">
                        <AppText className="text-accent">•</AppText>
                        <AppText className="text-foreground flex-1 leading-5">{ex}</AppText>
                      </View>
                    ))}
                  </View>
                )}

                {/* Insight */}
                {block.content.insight && (
                  <View className="bg-warning/10 rounded-xl p-3 mt-2">
                    <View className="flex-row items-start gap-2">
                      <AppText className="text-lg">💡</AppText>
                      <AppText className="text-warning font-medium flex-1 leading-5">
                        {block.content.insight}
                      </AppText>
                    </View>
                  </View>
                )}

                {/* PMBOK Reference */}
                {block.content.pmbokRef && (
                  <View className="mt-3">
                    <AppText className="text-muted text-xs italic">
                      📚 {block.content.pmbokRef}
                    </AppText>
                  </View>
                )}
              </View>
            )}
          </Card.Body>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export function ReasonScreen({ screen }: ReasonScreenProps) {
  const blocks = screen.blocks || [];

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 py-6"
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Animated.View
        entering={FadeInDown.duration(400).easing(Easing.out(Easing.ease))}
        className="mb-6"
      >
        <AppText className="text-foreground text-2xl font-bold">{screen.title}</AppText>
        <AppText className="text-muted mt-1">
          {blocks.length} concepts to explore
        </AppText>
      </Animated.View>

      {/* Content Blocks */}
      {blocks.map((block: any, index: number) => (
        <ContentBlock key={block.id} block={block} index={index} />
      ))}
    </ScrollView>
  );
}
