import React from 'react';
import {
  StyleSheet, View, Text, SafeAreaView,
  ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore, EXPENSE_CATEGORY_ICON, type ExpenseCategory } from '@/store/useOSStore';
import { Icon } from '@/components/ui/icon';
import { getIcon } from '@/utils/icons';
import { 
  ArrowLeft, 
  ChevronRight, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  User
} from 'lucide-react-native';

const typeColor: Record<string, string> = {
  Customer: '#00C805', Vendor: '#007AFF', Partner: '#FF9500', Other: '#8E8E93',
};

export default function ContactDetailScreen() {
  const { contactId } = useLocalSearchParams<{ contactId: string }>();
  const router = useRouter();
  const theme = Colors.light;
  const { contacts, transactions, items, identity } = useOSStore();
  const cur = identity.currency;

  const contact = contacts.find(c => c.id === contactId);
  const contactTxs = transactions.filter(t => t.contactId === contactId);

  if (!contact) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: theme.textHigh, fontSize: 18, fontWeight: '600' }}>Contact not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Icon icon={ArrowLeft} size={18} color={theme.primary} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.primary, fontWeight: '700' }}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalIn = contactTxs.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
  const totalOut = contactTxs.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);
  const color = typeColor[contact.type] ?? '#8E8E93';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon icon={ArrowLeft} size={20} color={theme.primary} />
              <Text style={[styles.backText, { color: theme.primary, marginLeft: 8 }]}>Back</Text>
            </View>
          </TouchableOpacity>

          {/* Contact Header */}
          <View style={styles.header}>
            <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
              <Text style={[styles.avatarText, { color }]}>{contact.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.contactName, { color: theme.textHigh }]}>{contact.name}</Text>
              <View style={[styles.badge, { backgroundColor: color + '15', alignSelf: 'flex-start' }]}>
                <Text style={[styles.badgeText, { color }]}>{contact.type}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.recordBtn, { backgroundColor: theme.primary }]}
              onPress={() => router.push({ pathname: '/(tabs)/transactions', params: { contactId: contact.id } })}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon icon={Plus} size={14} color="#FFF" />
                <Text style={styles.recordBtnText}>Record</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#E8FAE8' }]}>
              <Icon icon={TrendingUp} size={16} color={theme.positive} style={{ marginBottom: 6 }} />
              <Text style={[styles.statLabel, { color: theme.positive }]}>Revenue</Text>
              <Text style={[styles.statValue, { color: theme.positive }]}>{cur}{totalIn.toLocaleString()}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFF0EB' }]}>
              <Icon icon={TrendingDown} size={16} color={theme.negative} style={{ marginBottom: 6 }} />
              <Text style={[styles.statLabel, { color: theme.negative }]}>Expenses</Text>
              <Text style={[styles.statValue, { color: theme.negative }]}>{cur}{totalOut.toLocaleString()}</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F2F2F7' }]}>
              <Icon icon={Calendar} size={16} color={theme.textLow} style={{ marginBottom: 6 }} />
              <Text style={[styles.statLabel, { color: theme.textLow }]}>Ledger</Text>
              <Text style={[styles.statValue, { color: theme.textHigh }]}>{contactTxs.length}</Text>
            </View>
          </View>

          {/* Transaction History */}
          <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Transaction History</Text>
          {contactTxs.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyText, { color: theme.textLow }]}>No transactions yet</Text>
            </View>
          ) : (
            contactTxs.map(tx => {
              const item = items.find(i => i.id === tx.itemId);
              const isIn = tx.type === 'Money In';
              const catIconName = tx.expenseCategory ? EXPENSE_CATEGORY_ICON[tx.expenseCategory] : null;

              return (
                <TouchableOpacity
                  key={tx.id}
                  style={styles.txRow}
                  onPress={() => isIn && item && router.push({ pathname: '/invoice/[txId]', params: { txId: tx.id } })}
                  activeOpacity={isIn && item ? 0.7 : 1}
                >
                  <View style={[styles.txDot, { backgroundColor: isIn ? theme.positive : theme.negative }]} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {catIconName && (
                        <Icon icon={getIcon(catIconName)} size={12} color={theme.textLow} style={{ marginRight: 6 }} />
                      )}
                      <Text style={[styles.txTitle, { color: theme.textHigh }]}>
                        {item?.name ?? tx.expenseCategory ?? 'General Entry'}
                      </Text>
                    </View>
                    <Text style={[styles.txSub, { color: theme.textLow }]}>
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{tx.note ? ` · ${tx.note}` : ''}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.txAmt, { color: isIn ? theme.positive : theme.negative }]}>
                      {isIn ? '+' : '-'}{cur}{tx.amount.toLocaleString()}
                    </Text>
                    {isIn && item && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Text style={[styles.invoiceHint, { color: theme.primary }]}>Invoice</Text>
                        <Icon icon={ChevronRight} size={10} color={theme.primary} style={{ marginLeft: 2 }} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingTop: Spacing.xl },
  backBtn: { marginBottom: Spacing.lg },
  backText: { fontSize: 16, fontWeight: '600' },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 24, fontWeight: '800' },
  contactName: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  statCard: { flex: 1, padding: Spacing.md, borderRadius: 16, alignItems: 'center' },
  statLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '800' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: Spacing.md },
  emptyBox: { padding: Spacing.xl, alignItems: 'center' },
  emptyText: { fontSize: 15, fontWeight: '500' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  txDot: { width: 8, height: 8, borderRadius: 4 },
  txTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  txSub: { fontSize: 12, fontWeight: '500' },
  txAmt: { fontSize: 16, fontWeight: '800' },
  invoiceHint: { fontSize: 11, fontWeight: '700' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  recordBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  recordBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
});
