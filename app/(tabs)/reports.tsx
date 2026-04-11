import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

type Period = '7D' | '30D' | '90D' | 'ALL';

const PERIODS: Period[] = ['7D', '30D', '90D', 'ALL'];
const PERIOD_LABELS: Record<Period, string> = {
  '7D': '7 Days', '30D': '30 Days', '90D': '90 Days', 'ALL': 'All Time',
};

function getDayCutoff(period: Period): Date | null {
  if (period === 'ALL') return null;
  const days = { '7D': 7, '30D': 30, '90D': 90 }[period];
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export default function ReportsScreen() {
  const theme = Colors.light;
  const { transactions, contacts, items } = useOSStore();
  const [period, setPeriod] = useState<Period>('30D');

  // Filter by period — seed data has string dates like "Oct 25" so we pass all for those
  // For newly created transactions (ISO dates), we filter properly
  const filtered = useMemo(() => {
    const cutoff = getDayCutoff(period);
    if (!cutoff) return transactions;
    return transactions.filter(t => {
      // New transactions have date like "Apr 11", try parse; if invalid keep it
      const parsed = new Date(t.date + ` ${new Date().getFullYear()}`);
      if (isNaN(parsed.getTime())) return true; // keep unparseable seed data
      return parsed >= cutoff;
    });
  }, [transactions, period]);

  const revenue = filtered.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
  const expenses = filtered.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);
  const profit = revenue - expenses;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0.0';
  const isProfit = profit >= 0;

  // Top contacts by revenue
  const contactRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === 'Money In' && t.contactId).forEach(t => {
      map[t.contactId!] = (map[t.contactId!] ?? 0) + t.amount;
    });
    return Object.entries(map)
      .map(([id, amt]) => ({ contact: contacts.find(c => c.id === id), amt }))
      .filter(e => e.contact)
      .sort((a, b) => b.amt - a.amt)
      .slice(0, 5);
  }, [filtered, contacts]);

  // Top items by revenue
  const itemRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === 'Money In' && t.itemId).forEach(t => {
      map[t.itemId!] = (map[t.itemId!] ?? 0) + t.amount;
    });
    return Object.entries(map)
      .map(([id, amt]) => ({ item: items.find(i => i.id === id), amt }))
      .filter(e => e.item)
      .sort((a, b) => b.amt - a.amt)
      .slice(0, 5);
  }, [filtered, items]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          {/* Header */}
          <Text style={[styles.title, { color: theme.textHigh }]}>Reports</Text>

          {/* Period Selector */}
          <View style={styles.periodRow}>
            {PERIODS.map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.periodBtn,
                  period === p && { backgroundColor: theme.textHigh },
                ]}
                onPress={() => setPeriod(p)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.periodText,
                  { color: period === p ? '#FFF' : theme.textLow },
                ]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* P&L Hero */}
          <View style={[styles.plCard, { backgroundColor: isProfit ? '#EFFFEF' : '#FFF0F0' }]}>
            <Text style={[styles.plLabel, { color: isProfit ? '#1A7A1A' : '#990000' }]}>
              {isProfit ? 'Net Profit' : 'Net Loss'} · {PERIOD_LABELS[period]}
            </Text>
            <Text style={[styles.plValue, { color: isProfit ? theme.positive : theme.negative }]}>
              {isProfit ? '+' : '-'}${Math.abs(profit).toLocaleString()}
            </Text>
            <Text style={[styles.plMargin, { color: isProfit ? '#1A7A1A' : '#990000' }]}>
              {margin}% margin
            </Text>
          </View>

          {/* Revenue / Expense Cards */}
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: '#F0FFF0' }]}>
              <Text style={[styles.metricLabel, { color: theme.positive }]}>Revenue</Text>
              <Text style={[styles.metricValue, { color: theme.positive }]}>${revenue.toLocaleString()}</Text>
              <Text style={[styles.metricSub, { color: theme.textLow }]}>
                {filtered.filter(t => t.type === 'Money In').length} transactions
              </Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#FFF8F5' }]}>
              <Text style={[styles.metricLabel, { color: theme.negative }]}>Expenses</Text>
              <Text style={[styles.metricValue, { color: theme.negative }]}>${expenses.toLocaleString()}</Text>
              <Text style={[styles.metricSub, { color: theme.textLow }]}>
                {filtered.filter(t => t.type === 'Money Out').length} transactions
              </Text>
            </View>
          </View>

          {/* Top Customers */}
          {contactRevenue.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Top Customers</Text>
              {contactRevenue.map(({ contact, amt }, idx) => (
                <View key={contact!.id} style={styles.rankRow}>
                  <Text style={[styles.rankNum, { color: theme.textLow }]}>#{idx + 1}</Text>
                  <Text style={[styles.rankName, { color: theme.textHigh }]}>{contact!.name}</Text>
                  <Text style={[styles.rankValue, { color: theme.positive }]}>+${amt.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Top Items */}
          {itemRevenue.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Top Items</Text>
              {itemRevenue.map(({ item, amt }, idx) => (
                <View key={item!.id} style={styles.rankRow}>
                  <Text style={[styles.rankNum, { color: theme.textLow }]}>#{idx + 1}</Text>
                  <Text style={[styles.rankName, { color: theme.textHigh }]}>{item!.name}</Text>
                  <Text style={[styles.rankValue, { color: theme.positive }]}>+${amt.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Transaction Count Summary */}
          <View style={[styles.summaryBox, { backgroundColor: theme.surface }]}>
            <Text style={[styles.summaryText, { color: theme.textLow }]}>
              Showing <Text style={{ color: theme.textHigh, fontWeight: '700' }}>{filtered.length}</Text> transactions
              {' '}over <Text style={{ color: theme.textHigh, fontWeight: '700' }}>{PERIOD_LABELS[period]}</Text>
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingTop: 48, paddingBottom: Spacing.xxl },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5, marginBottom: Spacing.lg },
  periodRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  periodBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F2F2F7' },
  periodText: { fontSize: 13, fontWeight: '700' },
  plCard: { borderRadius: 20, padding: Spacing.xl, marginBottom: Spacing.md, alignItems: 'center' },
  plLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  plValue: { fontSize: 52, fontWeight: '800', letterSpacing: -2, marginBottom: 6 },
  plMargin: { fontSize: 16, fontWeight: '600' },
  metricsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  metricCard: { flex: 1, padding: Spacing.lg, borderRadius: 16 },
  metricLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  metricSub: { fontSize: 12, fontWeight: '500' },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.md },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rankNum: { fontSize: 13, fontWeight: '700', width: 28 },
  rankName: { flex: 1, fontSize: 15, fontWeight: '600' },
  rankValue: { fontSize: 15, fontWeight: '800' },
  summaryBox: { padding: Spacing.md, borderRadius: 12, alignItems: 'center' },
  summaryText: { fontSize: 14, fontWeight: '500' },
});
