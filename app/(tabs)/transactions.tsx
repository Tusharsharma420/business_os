import React, { useState } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore, Transaction } from '@/store/useOSStore';
import { useRouter } from 'expo-router';
import { BottomSheet } from '@/components/BottomSheet';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

type TxType = 'Money In' | 'Money Out';

export default function TransactionsScreen() {
  const theme = Colors.light;
  const router = useRouter();
  const transactions = useOSStore(s => s.transactions);
  const contacts = useOSStore(s => s.contacts);
  const items = useOSStore(s => s.items);
  const addTransaction = useOSStore(s => s.addTransaction);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [txType, setTxType] = useState<TxType>('Money In');
  const [amount, setAmount] = useState('');
  const [contactIdx, setContactIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);

  const totalIn = transactions.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);

  const handleAdd = () => {
    const parsed = parseFloat(amount);
    if (!parsed || isNaN(parsed)) return;
    addTransaction({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      type: txType,
      amount: parsed,
      contactId: contacts[contactIdx]?.id,
      itemId: txType === 'Money In' ? items[itemIdx]?.id : undefined,
      qty: 1,
    });
    setAmount('');
    setSheetVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.textHigh }]}>Transactions</Text>
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.primary }]}
            onPress={() => setSheetVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.fabText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Pills */}
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: '#E8FAE8' }]}>
            <Text style={[styles.pillLabel, { color: theme.positive }]}>In</Text>
            <Text style={[styles.pillValue, { color: theme.positive }]}>+${totalIn.toLocaleString()}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: '#FFF0EB' }]}>
            <Text style={[styles.pillLabel, { color: theme.negative }]}>Out</Text>
            <Text style={[styles.pillValue, { color: theme.negative }]}>-${totalOut.toLocaleString()}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: theme.surface }]}>
            <Text style={[styles.pillLabel, { color: theme.textLow }]}>Net</Text>
            <Text style={[styles.pillValue, { color: theme.textHigh }]}>${(totalIn - totalOut).toLocaleString()}</Text>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const contact = contacts.find(c => c.id === item.contactId);
            const product = items.find(i => i.id === item.itemId);
            const isIn = item.type === 'Money In';
            return (
              <View style={styles.row}>
                <View style={[styles.dot, { backgroundColor: isIn ? theme.positive : theme.negative }]} />
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <Text style={[styles.rowName, { color: theme.textHigh }]}>
                    {contact?.name ?? 'General Entry'}
                  </Text>
                  <Text style={[styles.rowSub, { color: theme.textLow }]}>
                    {item.date}{product ? ` · ${product.name}` : ''}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.rowAmount, { color: isIn ? theme.positive : theme.negative }]}>
                    {isIn ? '+' : '-'}${item.amount.toLocaleString()}
                  </Text>
                  {isIn && product && (
                    <TouchableOpacity
                      onPress={() => router.push({ pathname: '/invoice/[txId]', params: { txId: item.id } })}
                    >
                      <Text style={[styles.invoiceLink, { color: theme.primary }]}>Invoice →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* Add Transaction Sheet */}
      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title="Record Transaction"
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Toggle */}
          <View style={styles.toggleRow}>
            {(['Money In', 'Money Out'] as TxType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.toggleBtn,
                  txType === t && {
                    backgroundColor: t === 'Money In' ? theme.positive : theme.negative,
                  },
                ]}
                onPress={() => setTxType(t)}
              >
                <Text style={[
                  styles.toggleText,
                  { color: txType === t ? '#FFF' : theme.textLow },
                ]}>
                  {t === 'Money In' ? '↑ Money In' : '↓ Money Out'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FormInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />

          {/* Contact Picker */}
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
            <Text style={[styles.pickerLabel, { color: theme.textLow }]}>Contact</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {contacts.map((c, idx) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.chip,
                    idx === contactIdx && { backgroundColor: theme.primary },
                  ]}
                  onPress={() => setContactIdx(idx)}
                >
                  <Text style={[
                    styles.chipText,
                    { color: idx === contactIdx ? '#FFF' : theme.textHigh },
                  ]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Item Picker (only for Money In) */}
          {txType === 'Money In' && (
            <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
              <Text style={[styles.pickerLabel, { color: theme.textLow }]}>Item</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {items.map((item, idx) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.chip,
                      idx === itemIdx && { backgroundColor: '#333' },
                    ]}
                    onPress={() => setItemIdx(idx)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: idx === itemIdx ? '#FFF' : theme.textHigh },
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <PrimaryButton
            label={`Record ${txType}`}
            onPress={handleAdd}
            color={txType === 'Money In' ? theme.positive : theme.negative}
          />
        </ScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  fab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: 20,
  },
  fabText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  pillRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  pill: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  pillLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  pillValue: { fontSize: 16, fontWeight: '800' },
  listContainer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowName: { fontSize: 16, fontWeight: '600', marginBottom: 3 },
  rowSub: { fontSize: 12, fontWeight: '500' },
  rowAmount: { fontSize: 18, fontWeight: '800' },
  invoiceLink: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  toggleBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  toggleText: { fontSize: 14, fontWeight: '700' },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  chipScroll: { flexDirection: 'row' },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: Spacing.sm,
  },
  chipText: { fontSize: 14, fontWeight: '600' },
});
