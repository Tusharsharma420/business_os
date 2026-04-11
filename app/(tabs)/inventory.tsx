import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

export default function InventoryScreen() {
  const theme = Colors.light;
  const products = useOSStore(state => state.products);

  const physicalProducts = products.filter(p => p.itemType === 'physical');
  const services = products.filter(p => p.itemType === 'service');

  const renderItem = (item: any) => (
    <View key={item.id} style={styles.row}>
      <View>
        <Text style={[styles.name, { color: theme.textHigh }]}>{item.name}</Text>
        <Text style={[styles.sku, { color: theme.textLow }]}>{item.sku}</Text>
      </View>
      <View style={styles.stockContainer}>
        {item.itemType === 'physical' ? (
          <>
            <Text style={[
              styles.stockLevel,
              { color: (item.stockLevel || 0) < 5 ? theme.negative : theme.textHigh }
            ]}>
              {item.stockLevel}
            </Text>
            <Text style={[styles.stockLabel, { color: theme.textLow }]}>in stock</Text>
          </>
        ) : (
          <>
            <Text style={[styles.stockLevel, { color: theme.primary, fontSize: 18 }]}>∞</Text>
            <Text style={[styles.stockLabel, { color: theme.textLow }]}>Service</Text>
          </>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>Operations</Text>
        
        {/* Physical Products */}
        <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Physical Goods</Text>
        <View style={styles.listContainer}>
          {physicalProducts.map(renderItem)}
        </View>

        {/* Services */}
        <Text style={[styles.sectionTitle, { color: theme.textHigh, marginTop: Spacing.xl }]}>Services & Digital</Text>
        <View style={styles.listContainer}>
          {services.map(renderItem)}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingBottom: 80,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  listContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  sku: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  stockContainer: {
    alignItems: 'flex-end',
  },
  stockLevel: {
    fontSize: 20,
    fontWeight: '700',
  },
  stockLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  }
});
