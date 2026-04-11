import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

const STAGES = ['Lead', 'Negotiation', 'Closed'];

export default function SalesScreen() {
  const theme = Colors.light;
  const deals = useOSStore(state => state.deals);
  const customers = useOSStore(state => state.customers);
  const updateDealStage = useOSStore(state => state.updateDealStage);

  const advanceDeal = (id: string, currentStage: string) => {
    if (currentStage === 'Lead') updateDealStage(id, 'Negotiation');
    else if (currentStage === 'Negotiation') updateDealStage(id, 'Closed');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>Pipeline</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kanbanContainer}>
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            
            return (
              <View key={stage} style={styles.column}>
                <Text style={[styles.columnTitle, { color: theme.textLow }]}>
                  {stage} <Text style={styles.count}>({stageDeals.length})</Text>
                </Text>
                
                {stageDeals.map(deal => {
                  const customer = customers.find(c => c.id === deal.customerId);
                  return (
                    <TouchableOpacity 
                      key={deal.id} 
                      style={[styles.card, { backgroundColor: theme.surface }]}
                      onPress={() => advanceDeal(deal.id, deal.stage)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.cardCustomer, { color: theme.textHigh }]}>{customer ? customer.name : 'Unknown Client'}</Text>
                      <Text style={[styles.cardValue, { color: theme.primary }]}>${deal.value.toLocaleString()}</Text>
                    </TouchableOpacity>
                  );
                })}
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
