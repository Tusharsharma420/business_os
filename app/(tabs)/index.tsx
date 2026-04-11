import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

export default function DashboardScreen() {
  const theme = Colors.light;
  const transactions = useOSStore(state => state.transactions);

  // Compute minimal language insights
  const moneyIn = transactions.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
  const moneyOut = transactions.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);
  const currentBalance = moneyIn - moneyOut;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.greeting, { color: theme.textLow }]}>Overview</Text>
        <Text style={[styles.statement, { color: theme.textHigh }]}>
          Your net cash is <Text style={{ color: theme.positive }}>${currentBalance.toLocaleString()}</Text>.
        </Text>
        
        <View style={styles.insightBox}>
           <Text style={[styles.subStatement, { color: theme.textHigh }]}>
             You've collected ${moneyIn.toLocaleString()} in revenue.
           </Text>
        </View>

        <View style={styles.insightBox}>
           <Text style={[styles.subStatement, { color: theme.textHigh }]}>
             You've spent ${moneyOut.toLocaleString()} in operations.
           </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  statement: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    marginBottom: Spacing.xxl + 40,
    letterSpacing: -1,
  },
  insightBox: {
    padding: Spacing.lg,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  subStatement: {
    fontSize: 16,
    fontWeight: '500',
  }
});
