import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity,
} from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore, EXPENSE_CATEGORIES, EXPENSE_CATEGORY_EMOJI } from '@/store/useOSStore';

type Period = '7D' | '30D' | '90D' | 'ALL';
const PERIODS: Period[] = ['7D', '30D', '90D', 'ALL'];
const PERIOD_LABEL: Record<Period, string> = { '7D': '7 Days', '30D': '30 Days', '90D': '90 Days', 'ALL': 'All Time' };

function getDayCutoff(period: Period): Date | null {
  if (period === 'ALL') return null;
  const days = { '7D': 7, '30D': 30, '90D': 90 }[period];
  const d = new Date(); d.setDate(d.getDate() - days); return d;
}

export default function ReportsScreen() {
  const theme = Colors.light;
  const { transactions, contacts, items, identity } = useOSStore();
  const cur = identity.currency;
  const [period, setPeriod] = useState<Period>('30D');

  const filtered = useMemo(() => {
    const cutoff = getDayCutoff(period);
    if (!cutoff) return transactions;
    return transactions.filter(t => {
      const parsed = new Date(t.date + ` ${new Date().getFullYear()}`);
      return isNaN(parsed.getTime()) || parsed >= cutoff;
    });
  }, [transactions, period]);

  const revenue = filtered.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
  const expenses = filtered.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);
  const profit = revenue - expenses;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0.0';
  const isProfit = profit >= 0;

  // Expense breakdown by category
  const expenseBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === 'Money Out' && t.expenseCategory).forEach(t => {
      map[t.expenseCategory!] = (map[t.expenseCategory!] ?? 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  // Top contacts by revenue
  const contactRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === 'Money In' && t.contactId).forEach(t => { map[t.contactId!] = (map[t.contactId!] ?? 0) + t.amount; });
    return Object.entries(map).map(([id, amt]) => ({ contact: contacts.find(c => c.id === id), amt })).filter(e => e.contact).sort((a, b) => b.amt - a.amt).slice(0, 5);
  }, [filtered, contacts]);

  // Top items
  const itemRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === 'Money In' && t.itemId).forEach(t => { map[t.itemId!] = (map[t.itemId!] ?? 0) + t.amount; });
    return Object.entries(map).map(([id, amt]) => ({ item: items.find(i => i.id === id), amt })).filter(e => e.item).sort((a, b) => b.amt - a.amt).slice(0, 5);
  }, [filtered, items]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.textHigh }]}>Reports</Text>

          {/* Period pills */}
          <View style={styles.periodRow}>
            {PERIODS.map(p => (
              <TouchableOpacity key={p} style={[styles.periodBtn, period === p && { backgroundColor: theme.textHigh }]} onPress={() => setPeriod(p)} activeOpacity={0.8}>
                <Text style={[styles.periodText, { color: period === p ? '#FFF' : theme.textLow }]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* P&L Hero */}
          <View style={[styles.plCard, { backgroundColor: isProfit ? '#EFFFEF' : '#FFF0F0' }]}>
            <Text style={[styles.plLabel, { color: isProfit ? '#1A7A1A' : '#990000' }]}>
              {isProfit ? 'Net Profit' : 'Net Loss'} · {PERIOD_LABEL[period]}
            </Text>
            <Text style={[styles.plValue, { color: isProfit ? theme.positive : theme.negative }]}>
              {isProfit ? '+' : '-'}{cur}{Math.abs(profit).toLocaleString()}
            </Text>
            <Text style={[styles.plMargin, { color: isProfit ? '#1A7A1A' : '#990000' }]}>{margin}% margin</Text>
          </View>

          {/* Revenue/Expense cards */}
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { backgroundColor: '#F0FFF0' }]}>
              <Text style={[styles.metricLabel, { color: theme.positive }]}>Revenue</Text>
              <Text style={[styles.metricValue, { color: theme.positive }]}>{cur}{revenue.toLocaleString()}</Text>
              <Text style={[styles.metricSub, { color: theme.textLow }]}>{filtered.filter(t => t.type === 'Money In').length} in</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: '#FFF8F5' }]}>
              <Text style={[styles.metricLabel, { color: theme.negative }]}>Expenses</Text>
              <Text style={[styles.metricValue, { color: theme.negative }]}>{cur}{expenses.toLocaleString()}</Text>
              <Text style={[styles.metricSub, { color: theme.textLow }]}>{filtered.filter(t => t.type === 'Money Out').length} out</Text>
            </View>
          </View>

          {/* Expense breakdown by category */}
          {expenseBreakdown.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Expense Breakdown</Text>
              {expenseBreakdown.map(([cat, amt]) => {
                const pct = expenses > 0 ? (amt / expenses) * 100 : 0;
                return (
                  <View key={cat} style={styles.breakdownRow}>
                    <Text style={styles.breakdownEmoji}>{EXPENSE_CATEGORY_EMOJI[cat as any] ?? '🗂️'}</Text>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={styles.breakdownLabelRow}>
                        <Text style={[styles.breakdownCat, { color: theme.textHigh }]}>{cat}</Text>
                        <Text style={[styles.breakdownAmt, { color: theme.negative }]}>{cur}{amt.toLocaleString()}</Text>
                      </View>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: theme.negative }]} />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Top Customers */}
          {contactRevenue.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Top Customers</Text>
              {contactRevenue.map(({ contact, amt }, idx) => (
                <View key={contact!.id} style={styles.rankRow}>
                  <Text style={[styles.rankNum, { color: theme.textLow }]}>#{idx + 1}</Text>
                  <Text style={[styles.rankName, { color: theme.textHigh }]}>{contact!.name}</Text>
                  <Text style={[styles.rankValue, { color: theme.positive }]}>{cur}{amt.toLocaleString()}</Text>
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
                  <Text style={[styles.rankValue, { color: theme.positive }]}>{cur}{amt.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.summaryBox, { backgroundColor: theme.surface }]}>
            <Text style={[styles.summaryText, { color: theme.textLow }]}>
              <Text style={{ color: theme.textHigh, fontWeight: '700' }}>{filtered.length}</Text> transactions · {PERIOD_LABEL[period]}
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
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  breakdownEmoji: { fontSize: 20, width: 30 },
  breakdownLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  breakdownCat: { fontSize: 14, fontWeight: '600' },
  breakdownAmt: { fontSize: 14, fontWeight: '700' },
  barTrack: { height: 6, backgroundColor: '#F2F2F7', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
  rankRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  rankNum: { fontSize: 13, fontWeight: '700', width: 28 },
  rankName: { flex: 1, fontSize: 15, fontWeight: '600' },
  rankValue: { fontSize: 15, fontWeight: '800' },
  summaryBox: { padding: Spacing.md, borderRadius: 12, alignItems: 'center' },
  summaryText: { fontSize: 14, fontWeight: '500' },
});
