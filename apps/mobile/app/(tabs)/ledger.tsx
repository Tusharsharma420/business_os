import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ReceiptList, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { Theme } from '../../constants/Theme.js';
import { apiClient } from '../../src/api/client.js';

export default function LedgerScreen() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Note: We need a 'list transactions' endpoint on the backend
    // For now, we'll just show the screen structure
    setIsLoading(false);
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <ArrowUpRight size={20} color={Theme.colors.success} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.txDescription}>{item.description}</Text>
          <Text style={styles.txDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.txAmount}>${item.amount.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Cash Balance</Text>
        <Text style={styles.balanceAmount}>$0.00</Text>
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ReceiptList size={48} color={Theme.colors.border} />
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  balanceCard: {
    margin: Theme.spacing.md,
    padding: Theme.spacing.xl,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: Theme.spacing.xs,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text,
    marginLeft: Theme.spacing.md,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F9E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  txDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  txDate: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
    marginTop: Theme.spacing.md,
  },
});
