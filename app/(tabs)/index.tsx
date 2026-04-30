import React, { useState } from 'react';
import {
  StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ScrollView, RefreshControl, Image,
} from 'react-native';
import { AppleDesign } from '@/constants/AppleDesign';
import { useOSStore } from '@/store/useOSStore';
import { useDashboardLogic, getTimeOfDay } from '@/hooks/useDashboardLogic';
import { AppleCard } from '@/components/AppleCard';
import { Icon } from '@/components/ui/icon';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft,
  ChevronRight,
  Zap,
  Star,
  Users,
  Package
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function FeedScreen() {
  const router = useRouter();
  const { 
    identity, cur, net, moneyIn, moneyOut, recent, contacts, items, isPositive 
  } = useDashboardLogic();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Apple-Style Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</Text>
            <Text style={styles.title}>Summary</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
             <Text style={styles.profileInitial}>{identity.name.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Cash Card */}
        <AppleCard style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroLabel}>NET BALANCE</Text>
              <Text style={styles.heroValue}>{cur}{net.toLocaleString()}</Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: isPositive ? '#E8F5E9' : '#FFEBEE' }]}>
              <Text style={[styles.statusText, { color: isPositive ? '#2E7D32' : '#C62828' }]}>
                {isPositive ? 'HEALTHY' : 'CRITICAL'}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <TrendingUp size={16} color="#2E7D32" />
              </View>
              <View>
                <Text style={styles.statLabel}>Income</Text>
                <Text style={styles.statValue}>{cur}{moneyIn.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFEBEE' }]}>
                <TrendingDown size={16} color="#C62828" />
              </View>
              <View>
                <Text style={styles.statLabel}>Expense</Text>
                <Text style={styles.statValue}>{cur}{moneyOut.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </AppleCard>

        {/* Quick Insights Grid */}
        <View style={styles.insightGrid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/contacts')}>
             <AppleCard style={styles.miniCard}>
                <Users size={24} color={AppleDesign.colors.primary} />
                <Text style={styles.miniLabel}>People</Text>
                <Text style={styles.miniValue}>{contacts.length}</Text>
             </AppleCard>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('/items')}>
             <AppleCard style={styles.miniCard}>
                <Package size={24} color="#FF9500" />
                <Text style={styles.miniLabel}>Catalog</Text>
                <Text style={styles.miniValue}>{items.length}</Text>
             </AppleCard>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Feed */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={styles.seeAll}>History</Text>
          </TouchableOpacity>
        </View>

        {recent.length > 0 ? (
          recent.map((tx, idx) => {
            const contact = contacts.find(c => c.id === tx.contactId);
            const isIn = tx.type === 'Money In';
            return (
              <TouchableOpacity key={tx.id} activeOpacity={0.7}>
                <AppleCard style={styles.txCard}>
                  <View style={styles.txRow}>
                    <View style={[styles.txIcon, { backgroundColor: isIn ? '#E8F5E9' : '#F5F5F7' }]}>
                      <Icon icon={isIn ? ArrowDownLeft : ArrowUpRight} size={20} color={isIn ? '#2E7D32' : '#1C1C1E'} />
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txName}>{contact?.name ?? 'General Transaction'}</Text>
                      <Text style={styles.txDate}>{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                    </View>
                    <View style={styles.txAmtCol}>
                      <Text style={[styles.txAmount, { color: isIn ? '#2E7D32' : '#1C1C1E' }]}>
                        {isIn ? '+' : '-'}{cur}{tx.amount.toLocaleString()}
                      </Text>
                      <ChevronRight size={14} color={AppleDesign.colors.text.low} />
                    </View>
                  </View>
                </AppleCard>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Zap size={48} color="#E5E5EA" />
            <Text style={styles.emptyText}>No activity yet. Tap + to start.</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Global Magic FAB Implementation in tab screen */}
      <TouchableOpacity 
        style={styles.magicFab} 
        onPress={() => router.push('/(tabs)/transactions')}
        activeOpacity={0.9}
      >
        <Plus color="#fff" size={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppleDesign.colors.background,
  },
  scrollContent: {
    paddingHorizontal: AppleDesign.spacing.lg,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: 20,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppleDesign.colors.text.low,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    ...AppleDesign.typography.h1,
    color: AppleDesign.colors.text.high,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  heroCard: {
    padding: 20,
    marginBottom: 20,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: AppleDesign.colors.text.low,
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 34,
    fontWeight: '800',
    color: AppleDesign.colors.text.high,
    letterSpacing: -1,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: AppleDesign.colors.text.low,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: AppleDesign.colors.text.high,
  },
  insightGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  gridItem: {
    flex: 1,
  },
  miniCard: {
    padding: 16,
    alignItems: 'flex-start',
  },
  miniLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: AppleDesign.colors.text.low,
    marginTop: 12,
  },
  miniValue: {
    fontSize: 20,
    fontWeight: '800',
    color: AppleDesign.colors.text.high,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: AppleDesign.colors.text.high,
  },
  seeAll: {
    fontSize: 15,
    fontWeight: '600',
    color: AppleDesign.colors.primary,
  },
  txCard: {
    marginBottom: 12,
    padding: 12,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfo: {
    flex: 1,
    marginLeft: 14,
  },
  txName: {
    fontSize: 16,
    fontWeight: '700',
    color: AppleDesign.colors.text.high,
  },
  txDate: {
    fontSize: 13,
    color: AppleDesign.colors.text.low,
    marginTop: 2,
  },
  txAmtCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  txAmount: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppleDesign.colors.text.low,
    marginTop: 16,
  },
  magicFab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppleDesign.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppleDesign.shadows.floating,
  }
});
