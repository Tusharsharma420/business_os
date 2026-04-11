import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const theme = Colors.light;
  const router = useRouter();
  const { transactions, contacts, items, identity } = useOSStore();
  const cur = identity.currency;

  const moneyIn = transactions.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
  const moneyOut = transactions.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);
  const net = moneyIn - moneyOut;
  const isPositive = net >= 0;

  // Recent 3 transactions for activity feed
  const recent = transactions.slice(0, 4);

  // Top item by frequency
  const itemFreq: Record<string, number> = {};
  transactions.filter(t => t.itemId).forEach(t => { itemFreq[t.itemId!] = (itemFreq[t.itemId!] ?? 0) + 1; });
  const topItemId = Object.entries(itemFreq).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topItem = items.find(i => i.id === topItemId);

  const customers = contacts.filter(c => c.type === 'Customer').length;
  const vendors = contacts.filter(c => c.type === 'Vendor').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Greeting + Search button */}
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.greeting, { color: theme.textLow }]}>Good {getTimeOfDay()}</Text>
            <Text style={[styles.bizName, { color: theme.textHigh }]} numberOfLines={1}>{identity.name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.searchBtn, { backgroundColor: '#F2F2F7' }]}
            onPress={() => router.push('/search')}
            activeOpacity={0.8}
          >
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Net Cash */}
        <View style={[styles.heroCard, { backgroundColor: isPositive ? '#EFFFEF' : '#FFF0F0' }]}>
          <Text style={[styles.heroLabel, { color: isPositive ? '#1A7A1A' : '#990000' }]}>Net Cash</Text>
          <Text style={[styles.heroValue, { color: isPositive ? theme.positive : theme.negative }]}>
            {cur}{net.toLocaleString()}
          </Text>
          <View style={styles.heroSubRow}>
            <Text style={[styles.heroSub, { color: theme.positive }]}>↑ {cur}{moneyIn.toLocaleString()}</Text>
            <Text style={[styles.heroSubDot, { color: theme.textLow }]}> · </Text>
            <Text style={[styles.heroSub, { color: theme.negative }]}>↓ {cur}{moneyOut.toLocaleString()}</Text>
          </View>
        </View>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#F8F8FF' }]} onPress={() => router.push('/(tabs)/contacts')} activeOpacity={0.8}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={[styles.statValue, { color: theme.textHigh }]}>{customers}</Text>
            <Text style={[styles.statLabel, { color: theme.textLow }]}>Customers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#FFF8F0' }]} onPress={() => router.push('/(tabs)/contacts')} activeOpacity={0.8}>
            <Text style={styles.statEmoji}>🏭</Text>
            <Text style={[styles.statValue, { color: theme.textHigh }]}>{vendors}</Text>
            <Text style={[styles.statLabel, { color: theme.textLow }]}>Vendors</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#F0FFF8' }]} onPress={() => router.push('/(tabs)/items')} activeOpacity={0.8}>
            <Text style={styles.statEmoji}>📦</Text>
            <Text style={[styles.statValue, { color: theme.textHigh }]}>{items.length}</Text>
            <Text style={[styles.statLabel, { color: theme.textLow }]}>Items</Text>
          </TouchableOpacity>
        </View>

        {/* Top item insight */}
        {topItem && (
          <View style={[styles.insightCard, { backgroundColor: '#F0F4FF' }]}>
            <Text style={[styles.insightText, { color: '#1A3A99' }]}>
              🏆  Best seller: <Text style={{ fontWeight: '800' }}>{topItem.name}</Text>
            </Text>
          </View>
        )}

        {/* Recent Activity */}
        {recent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Recent</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
                <Text style={[styles.seeAll, { color: theme.primary }]}>See all →</Text>
              </TouchableOpacity>
            </View>
            {recent.map(tx => {
              const contact = contacts.find(c => c.id === tx.contactId);
              const isIn = tx.type === 'Money In';
              return (
                <View key={tx.id} style={styles.activityRow}>
                  <View style={[styles.activityDot, { backgroundColor: isIn ? theme.positive : theme.negative }]} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.activityName, { color: theme.textHigh }]}>{contact?.name ?? 'Entry'}</Text>
                    <Text style={[styles.activityDate, { color: theme.textLow }]}>{tx.date}</Text>
                  </View>
                  <Text style={[styles.activityAmt, { color: isIn ? theme.positive : theme.negative }]}>
                    {isIn ? '+' : '-'}{cur}{tx.amount.toLocaleString()}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.positive }]} onPress={() => router.push('/(tabs)/transactions')} activeOpacity={0.85}>
            <Text style={styles.actionText}>+ Record</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#007AFF' }]} onPress={() => router.push('/(tabs)/contacts')} activeOpacity={0.85}>
            <Text style={styles.actionText}>+ Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#333' }]} onPress={() => router.push('/(tabs)/reports')} activeOpacity={0.85}>
            <Text style={styles.actionText}>Reports →</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingTop: 48, paddingBottom: Spacing.xxl },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  greeting: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  bizName: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  searchBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  searchIcon: { fontSize: 18 },
  heroCard: { borderRadius: 20, padding: Spacing.xl, marginBottom: Spacing.md },
  heroLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  heroValue: { fontSize: 48, fontWeight: '800', letterSpacing: -2, marginBottom: 8 },
  heroSubRow: { flexDirection: 'row', alignItems: 'center' },
  heroSub: { fontSize: 14, fontWeight: '700' },
  heroSubDot: { fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: { flex: 1, padding: Spacing.md, borderRadius: 16, alignItems: 'center' },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  insightCard: { padding: Spacing.md, borderRadius: 16, marginBottom: Spacing.md },
  insightText: { fontSize: 15, fontWeight: '500' },
  section: { marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  activityName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  activityDate: { fontSize: 12, fontWeight: '500' },
  activityAmt: { fontSize: 16, fontWeight: '800' },
  actionsRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  actionBtn: { flex: 1, padding: Spacing.md, borderRadius: 14, alignItems: 'center' },
  actionText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
});
