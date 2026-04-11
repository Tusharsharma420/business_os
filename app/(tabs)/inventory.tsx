import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

export default function InventoryScreen() {
  const theme = Colors.light;
  const products = useOSStore(state => state.products);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>Operations</Text>
        <Text style={[styles.subtitle, { color: theme.textLow }]}>Live Inventory & SKUs</Text>
        
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View>
                <Text style={[styles.name, { color: theme.textHigh }]}>{item.name}</Text>
                <Text style={[styles.sku, { color: theme.textLow }]}>{item.sku}</Text>
              </View>
              <View style={styles.stockContainer}>
                <Text style={[
                  styles.stockLevel,
                  { color: item.stockLevel < 5 ? theme.negative : theme.textHigh }
                ]}>
                  {item.stockLevel}
                </Text>
                <Text style={[styles.stockLabel, { color: theme.textLow }]}>in stock</Text>
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
  sku: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  stockContainer: {
    alignItems: 'flex-end',
  },
  stockLevel: {
    fontSize: 24,
    fontWeight: '700',
  },
  stockLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  }
});
