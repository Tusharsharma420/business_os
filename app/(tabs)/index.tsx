import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { 
  Search, AlertTriangle, Users, Factory, Package, Trophy, ArrowRight, TrendingUp, TrendingDown 
} from 'lucide-react-native';
import { useDashboardLogic, getTimeOfDay } from '@/hooks/useDashboardLogic';

export default function DashboardScreen() {
  const theme = Colors.light;
  const router = useRouter();
  
  // Clean injected domain logic
  const { 
    identity, cur, moneyIn, moneyOut, net, isPositive, recent, 
    topItem, customers, vendors, totalItems, lowStockItems, 
    monthlyRevenue, goalProgress, contacts 
  } = useDashboardLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

        {/* Header Region */}
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.greeting, { color: theme.textLow }]}>Good {getTimeOfDay()}</Text>
            <Text style={[styles.bizName, { color: theme.textHigh }]} numberOfLines={1}>{identity.name}</Text>
          </View>
          <TouchableOpacity style={[styles.searchBtn, { backgroundColor: '#F2F2F7' }]} onPress={() => router.push('/search')} activeOpacity={0.8}>
            <Icon icon={Search} size={20} color={theme.textLow} />
          </TouchableOpacity>
        </View>

        {/* Hero Financial Indicator */}
        <View style={[styles.heroCard, { backgroundColor: isPositive ? '#EFFFEF' : '#FFF0F0' }]}>
          <Text style={[styles.heroLabel, { color: isPositive ? '#1A7A1A' : '#990000' }]}>Net Cash</Text>
          <Text style={[styles.heroValue, { color: isPositive ? theme.positive : theme.negative }]}>{cur}{net.toLocaleString()}</Text>
          <View style={styles.heroSubRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon icon={TrendingUp} size={14} color={theme.positive} style={{ marginRight: 4 }} />
              <Text style={[styles.heroSub, { color: theme.positive }]}>{cur}{moneyIn.toLocaleString()}</Text>
            </View>
            <Text style={[styles.heroSubDot, { color: theme.textLow }]}> · </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon icon={TrendingDown} size={14} color={theme.negative} style={{ marginRight: 4 }} />
              <Text style={[styles.heroSub, { color: theme.negative }]}>{cur}{moneyOut.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Goals & KPI Component */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalLabel}>Monthly Goal</Text>
            <Text style={styles.goalValue}>{goalProgress.toFixed(0)}%</Text>
          </View>
          <View style={styles.goalTrack}>
            <View style={[styles.goalFill, { width: `${goalProgress}%`, backgroundColor: theme.primary }]} />
          </View>
          <Text style={styles.goalSub}>{cur}{monthlyRevenue.toLocaleString()} of {cur}{identity.monthlyRevenueGoal.toLocaleString()}</Text>
        </View>

        {/* Automated System Alerts */}
        {lowStockItems.length > 0 && (
          <TouchableOpacity style={[styles.alertCard, { borderColor: theme.negative }]} onPress={() => router.push('/(tabs)/items')}>
            <Icon icon={AlertTriangle} size={18} color={theme.negative} style={{ marginRight: 10 }} />
            <Text style={styles.alertText}><Text style={{ fontWeight: '800' }}>{lowStockItems.length}</Text> items are low on stock</Text>
          </TouchableOpacity>
        )}

        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#F8F8FF' }]} onPress={() => router.push('/(tabs)/contacts')}>
            <Icon icon={Users} size={20} color="#007AFF" style={{ marginBottom: 6 }} />
            <Text style={[styles.statValue, { color: theme.textHigh }]}>{customers}</Text>
            <Text style={[styles.statLabel, { color: theme.textLow }]}>Customers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#FFF8F0' }]} onPress={() => router.push('/(tabs)/contacts')}>
            <Icon icon={Factory} size={20} color="#FF9500" style={{ marginBottom: 6 }} />
            <Text style={[styles.statValue, { color: theme.textHigh }]}>{vendors}</Text>
            <Text style={[styles.statLabel, { color: theme.textLow }]}>Vendors</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#F0FFF8' }]} onPress={() => router.push('/(tabs)/items')}>
            <Icon icon={Package} size={20} color="#34C759" style={{ marginBottom: 6 }} />
            <Text style={[styles.statValue, { color: theme.textHigh }]}>{totalItems}</Text>
            <Text style={[styles.statLabel, { color: theme.textLow }]}>Items</Text>
          </TouchableOpacity>
        </View>

        {topItem && (
          <View style={[styles.insightCard, { backgroundColor: '#F0F4FF' }]}>
            <Text style={[styles.insightText, { color: '#1A3A99' }]}>
              <Icon icon={Trophy} size={16} color="#1A3A99" style={{ marginRight: 8 }} /> Best seller: <Text style={{ fontWeight: '800' }}>{topItem.name}</Text>
            </Text>
          </View>
        )}

        {/* Reduced Timeline Generator */}
        {recent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Recent</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
                <Icon icon={ArrowRight} size={14} color={theme.primary} style={{ marginLeft: 4 }} />
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
                    <Text style={[styles.activityDate, { color: theme.textLow }]}>{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                  </View>
                  <Text style={[styles.activityAmt, { color: isIn ? theme.positive : theme.negative }]}>{isIn ? '+' : '-'}{cur}{tx.amount.toLocaleString()}</Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.positive }]} onPress={() => router.push('/(tabs)/transactions')} activeOpacity={0.85}>
            <Text style={styles.actionText}>Record Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#007AFF' }]} onPress={() => router.push('/(tabs)/contacts')} activeOpacity={0.85}>
            <Text style={styles.actionText}>Add Contact</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingTop: 48, paddingBottom: Spacing.xxl },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  greeting: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  bizName: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  searchBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  heroCard: { borderRadius: 20, padding: Spacing.xl, marginBottom: Spacing.md },
  heroLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  heroValue: { fontSize: 48, fontWeight: '800', letterSpacing: -2, marginBottom: 8 },
  heroSubRow: { flexDirection: 'row', alignItems: 'center' },
  heroSub: { fontSize: 14, fontWeight: '700' },
  heroSubDot: { fontSize: 14 },
  goalCard: { backgroundColor: '#F2F2F7', borderRadius: 16, padding: Spacing.md, marginBottom: Spacing.md },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goalLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', color: '#666' },
  goalValue: { fontSize: 14, fontWeight: '800' },
  goalTrack: { height: 6, backgroundColor: '#E5E5EA', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  goalFill: { height: '100%', borderRadius: 3 },
  goalSub: { fontSize: 12, fontWeight: '500', color: '#666' },
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F0', padding: 12, borderRadius: 12, marginBottom: Spacing.md, borderLeftWidth: 4 },
  alertText: { fontSize: 14, fontWeight: '500', color: '#990000' },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  statCard: { flex: 1, padding: Spacing.md, borderRadius: 16, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  insightCard: { padding: Spacing.md, borderRadius: 16, marginBottom: Spacing.md },
  insightText: { fontSize: 15, fontWeight: '500', flexDirection: 'row', alignItems: 'center' },
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
