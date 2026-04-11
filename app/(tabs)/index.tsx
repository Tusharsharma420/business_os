import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const theme = Colors.light;
  const router = useRouter();
  const transactions = useOSStore(s => s.transactions);
  const contacts = useOSStore(s => s.contacts);
  const items = useOSStore(s => s.items);
  const identity = useOSStore(s => s.identity);

  const moneyIn = transactions.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
  const moneyOut = transactions.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);
  const net = moneyIn - moneyOut;
  const unpaid = transactions.filter(t => t.type === 'Money In').length; // simplified

  // Top item by frequency
  const itemFreq: Record<string, number> = {};
  transactions.filter(t => t.itemId).forEach(t => {
    itemFreq[t.itemId!] = (itemFreq[t.itemId!] ?? 0) + 1;
  });
  const topItemId = Object.entries(itemFreq).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topItem = items.find(i => i.id === topItemId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        {/* Greeting */}
        <Text style={[styles.greeting, { color: theme.textLow }]}>
          {identity.name}
        </Text>

        {/* Hero stat */}
        <View style={styles.heroCard}>
          <Text style={[styles.heroLabel, { color: theme.textLow }]}>Net Cash</Text>
          <Text style={[styles.heroValue, { color: net >= 0 ? theme.positive : theme.negative }]}>
            ${net.toLocaleString()}
          </Text>
        </View>

        {/* Plain-language insights */}
        <View style={styles.insightStack}>
          <View style={[styles.insightCard, { backgroundColor: '#EFFFEF' }]}>
            <Text style={[styles.insightText, { color: '#1A7A1A' }]}>
              💰  You've collected <Text style={{ fontWeight: '800' }}>${moneyIn.toLocaleString()}</Text> in revenue.
            </Text>
          </View>

          <View style={[styles.insightCard, { backgroundColor: '#FFF4EE' }]}>
            <Text style={[styles.insightText, { color: '#A03000' }]}>
              📤  You've spent <Text style={{ fontWeight: '800' }}>${moneyOut.toLocaleString()}</Text> in operations.
            </Text>
          </View>

          {topItem && (
            <View style={[styles.insightCard, { backgroundColor: '#F0F4FF' }]}>
              <Text style={[styles.insightText, { color: '#1A3A99' }]}>
                🏆  Top item: <Text style={{ fontWeight: '800' }}>{topItem.name}</Text>
              </Text>
            </View>
          )}

          <View style={[styles.insightCard, { backgroundColor: '#F6F6F6' }]}>
            <Text style={[styles.insightText, { color: theme.textHigh }]}>
              👥  <Text style={{ fontWeight: '800' }}>{contacts.length}</Text> contacts · <Text style={{ fontWeight: '800' }}>{items.length}</Text> catalog items
            </Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.positive }]}
            onPress={() => router.push('/(tabs)/transactions')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionText}>+ Record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#007AFF' }]}
            onPress={() => router.push('/(tabs)/contacts')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionText}>+ Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#333' }]}
            onPress={() => router.push('/(tabs)/items')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionText}>+ Item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.xl,
    paddingTop: 48,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  heroCard: {
    marginBottom: Spacing.xl,
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -2,
  },
  insightStack: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  insightCard: {
    padding: Spacing.md,
    borderRadius: 16,
  },
  insightText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
