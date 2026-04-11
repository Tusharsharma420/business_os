import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

export default function LedgerScreen() {
  const theme = Colors.light;
  const transactions = useOSStore(state => state.transactions);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>Ledger</Text>
        
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View>
                <Text style={[styles.name, { color: theme.textHigh }]}>{item.name}</Text>
                <Text style={[styles.date, { color: theme.textLow }]}>{item.date}</Text>
              </View>
              <Text style={[
                styles.amount,
                { color: item.amount > 0 ? theme.positive : theme.textHigh }
              ]}>
                {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  }
});
