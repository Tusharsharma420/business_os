import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';

const STAGES = ['Lead', 'Negotiation', 'Closed'];
const MOCK_DEALS = [
  { id: '1', customer: 'Acme Corp', value: 5000, stage: 'Closed' },
  { id: '2', customer: 'Global Tech', value: 12000, stage: 'Negotiation' },
  { id: '3', customer: 'Stark Ind.', value: 450, stage: 'Lead' },
  { id: '4', customer: 'Wayne Ent.', value: 8900, stage: 'Negotiation' },
];

export default function SalesScreen() {
  const theme = Colors.light;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>Pipeline</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kanbanContainer}>
          {STAGES.map(stage => {
            const stageDeals = MOCK_DEALS.filter(d => d.stage === stage);
            
            return (
              <View key={stage} style={styles.column}>
                <Text style={[styles.columnTitle, { color: theme.textLow }]}>
                  {stage} <Text style={styles.count}>({stageDeals.length})</Text>
                </Text>
                
                {stageDeals.map(deal => (
                  <View key={deal.id} style={[styles.card, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.cardCustomer, { color: theme.textHigh }]}>{deal.customer}</Text>
                    <Text style={[styles.cardValue, { color: theme.primary }]}>${deal.value.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  kanbanContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  column: {
    width: 280,
    marginHorizontal: Spacing.xs,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  count: {
    fontWeight: '400',
  },
  card: {
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  cardCustomer: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
  }
});
