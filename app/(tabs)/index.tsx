import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

export default function DashboardScreen() {
  const theme = Colors.light;
  const cashflow = useOSStore(state => state.cashflow);
  const activityFeed = useOSStore(state => state.activityFeed);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.label, { color: theme.textLow }]}>Total Cashflow</Text>
          <Text style={[styles.largeValue, { color: theme.textHigh }]}>
            ${cashflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={[styles.sparkline, { backgroundColor: theme.primary }]} />
        </View>

        <View style={styles.activitySection}>
          <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Activity Feed</Text>
          <FlatList
            data={activityFeed}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.activityRow}>
                <Text style={[styles.activityTitle, { color: theme.textHigh }]}>{item.title}</Text>
                {item.amount !== undefined && (
                  <Text style={[
                    styles.activityAmount, 
                    { color: item.type === 'positive' ? theme.positive : theme.negative }
                  ]}>
                    {item.amount > 0 ? '+' : ''}${Math.abs(item.amount).toLocaleString()}
                  </Text>
                )}
              </View>
            )}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  largeValue: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
  },
  sparkline: {
    height: 4,
    width: 60,
    marginTop: Spacing.md,
    borderRadius: 2,
  },
  activitySection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '600',
  }
});
