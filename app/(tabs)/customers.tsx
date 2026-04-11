import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

export default function CustomersScreen() {
  const theme = Colors.light;
  const customers = useOSStore(state => state.customers);
  
  // Order mathematically by Lifetime Value descending
  const sortedCustomers = [...customers].sort((a, b) => b.lifetimeValue - a.lifetimeValue);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>Customers</Text>
        <Text style={[styles.subtitle, { color: theme.textLow }]}>Sorted by Lifetime Value</Text>
        
        <FlatList
          data={sortedCustomers}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View>
                <Text style={[styles.name, { color: theme.textHigh }]}>{item.name}</Text>
                <View style={styles.badgeContainer}>
                  <Text style={[
                     styles.badge, 
                     { backgroundColor: item.status === 'Active' ? theme.primary : '#E5E7EB',
                       color: item.status === 'Active' ? '#FFF' : theme.textHigh }
                  ]}>
                     {item.status}
                  </Text>
                </View>
              </View>
              <View style={styles.valueContainer}>
                <Text style={[styles.ltvValue, { color: theme.primary }]}>
                  ${item.lifetimeValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </Text>
                <Text style={[styles.ltvLabel, { color: theme.textLow }]}>LTV</Text>
              </View>
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
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.xl,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  ltvValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  ltvLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  }
});
