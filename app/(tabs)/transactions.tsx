import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  SafeAreaView, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import {
  useOSStore,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_EMOJI,
  type ExpenseCategory,
} from '@/store/useOSStore';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BottomSheet } from '@/components/BottomSheet';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

type TxType = 'Money In' | 'Money Out';

export default function TransactionsScreen() {
  const theme = Colors.light;
  const router = useRouter();
  const { contactId, add } = useLocalSearchParams();
  const { transactions, contacts, items, addTransaction, deleteTransaction, addContact, addItem, identity } = useOSStore();
  const cur = identity.currency;

  const [sheetVisible, setSheetVisible] = useState(false);
  const [txType, setTxType] = useState<TxType>('Money In');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [contactIdx, setContactIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [expenseCat, setExpenseCat] = useState<ExpenseCategory>('Other');

  // In-place addition states
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  // Handle incoming params (e.g. from Contact Detail)
  useEffect(() => {
    if (contactId) {
      const idx = contacts.findIndex(c => c.id === contactId);
      if (idx !== -1) {
        setContactIdx(idx);
        setSheetVisible(true);
      }
    } else if (add === 'true') {
      setSheetVisible(true);
    }
  }, [contactId, add, contacts]);

  const totalIn = transactions.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);

  const handleAddTx = () => {
    const parsed = parseFloat(amount);
    if (!parsed || isNaN(parsed)) return;
    addTransaction({
      date: new Date().toISOString(),
      type: txType,
      amount: parsed,
      contactId: contacts[contactIdx]?.id,
      itemId: txType === 'Money In' ? items[itemIdx]?.id : undefined,
      qty: 1,
      note: note.trim() || undefined,
      expenseCategory: txType === 'Money Out' ? expenseCat : undefined,
    });
    setAmount(''); setNote(''); setSheetVisible(false);
  };

  const handleQuickAddContact = () => {
    if (!newContactName.trim()) return;
    addContact({ name: newContactName.trim(), type: 'Customer' });
    setNewContactName('');
    setIsAddingContact(false);
    // New contact will be last in the list
    setContactIdx(contacts.length);
  };

  const handleQuickAddItem = () => {
    if (!newItemName.trim()) return;
    addItem({ name: newItemName.trim(), price: 0, category: 'General' });
    setNewItemName('');
    setIsAddingItem(false);
    // New item will be last in the list
    setItemIdx(items.length);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Transaction', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.textHigh }]}>Transactions</Text>
          <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={() => setSheetVisible(true)} activeOpacity={0.85}>
            <Text style={styles.fabText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Summary pills */}
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: '#E8FAE8' }]}>
            <Text style={[styles.pillLabel, { color: theme.positive }]}>In</Text>
            <Text style={[styles.pillValue, { color: theme.positive }]}>{cur}{totalIn.toLocaleString()}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: '#FFF0EB' }]}>
            <Text style={[styles.pillLabel, { color: theme.negative }]}>Out</Text>
            <Text style={[styles.pillValue, { color: theme.negative }]}>{cur}{totalOut.toLocaleString()}</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: theme.surface }]}>
            <Text style={[styles.pillLabel, { color: theme.textLow }]}>Net</Text>
            <Text style={[styles.pillValue, { color: theme.textHigh }]}>{cur}{(totalIn - totalOut).toLocaleString()}</Text>
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
            const catEmoji = item.expenseCategory ? EXPENSE_CATEGORY_EMOJI[item.expenseCategory] : null;
            const displayDate = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <TouchableOpacity style={styles.row} onLongPress={() => handleDelete(item.id)} activeOpacity={0.7}>
                <View style={[styles.dot, { backgroundColor: isIn ? theme.positive : theme.negative }]} />
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <Text style={[styles.rowName, { color: theme.textHigh }]}>
                    {contact?.name ?? 'General Entry'}
                  </Text>
                  <Text style={[styles.rowSub, { color: theme.textLow }]}>
                    {displayDate}
                    {catEmoji ? ` · ${catEmoji} ${item.expenseCategory}` : ''}
                    {product ? ` · ${product.name}` : ''}
                    {item.note ? ` · ${item.note}` : ''}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.rowAmount, { color: isIn ? theme.positive : theme.negative }]}>
                    {isIn ? '+' : '-'}{cur}{item.amount.toLocaleString()}
                  </Text>
                  {isIn && product && (
                    <TouchableOpacity onPress={() => router.push({ pathname: '/invoice/[txId]', params: { txId: item.id } })}>
                      <Text style={[styles.invoiceLink, { color: theme.primary }]}>Invoice →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Add Sheet */}
      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} title="Record Transaction">
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Type Toggle */}
          <View style={styles.toggleRow}>
            {(['Money In', 'Money Out'] as TxType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.toggleBtn, txType === t && { backgroundColor: t === 'Money In' ? theme.positive : theme.negative }]}
                onPress={() => setTxType(t)}
              >
                <Text style={[styles.toggleText, { color: txType === t ? '#FFF' : theme.textLow }]}>
                  {t === 'Money In' ? '↑ Money In' : '↓ Money Out'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FormInput label={`Amount (${cur})`} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" />
          <FormInput label="Note (optional)" value={note} onChangeText={setNote} placeholder="e.g. Q1 invoice" />

          {/* Contact Picker */}
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerLabel}>Contact</Text>
              {!isAddingContact && (
                <TouchableOpacity onPress={() => setIsAddingContact(true)}>
                  <Text style={[styles.quickAddText, { color: theme.primary }]}>+ New</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {isAddingContact ? (
              <View style={styles.quickAddRow}>
                <FormInput 
                  value={newContactName} 
                  onChangeText={setNewContactName} 
                  placeholder="Contact Name" 
                  containerStyle={{ flex: 1, paddingHorizontal: 0, marginBottom: 0 }}
                />
                <TouchableOpacity style={[styles.quickAddBtn, { backgroundColor: theme.primary }]} onPress={handleQuickAddContact}>
                  <Text style={styles.quickAddBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsAddingContact(false)}>
                  <Text style={{ fontSize: 18, color: theme.textLow, marginLeft: 10 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {contacts.map((c, idx) => (
                  <TouchableOpacity key={c.id} style={[styles.chip, idx === contactIdx && { backgroundColor: theme.primary }]} onPress={() => setContactIdx(idx)}>
                    <Text style={[styles.chipText, { color: idx === contactIdx ? '#FFF' : theme.textHigh }]}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Money In: Item Picker */}
          {txType === 'Money In' && (
            <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerLabel}>Item</Text>
                {!isAddingItem && (
                  <TouchableOpacity onPress={() => setIsAddingItem(true)}>
                    <Text style={[styles.quickAddText, { color: theme.primary }]}>+ New</Text>
                  </TouchableOpacity>
                )}
              </View>

              {isAddingItem ? (
                <View style={styles.quickAddRow}>
                  <FormInput 
                    value={newItemName} 
                    onChangeText={setNewItemName} 
                    placeholder="Item Name" 
                    containerStyle={{ flex: 1, paddingHorizontal: 0, marginBottom: 0 }}
                  />
                  <TouchableOpacity style={[styles.quickAddBtn, { backgroundColor: '#333' }]} onPress={handleQuickAddItem}>
                    <Text style={styles.quickAddBtnText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsAddingItem(false)}>
                    <Text style={{ fontSize: 18, color: theme.textLow, marginLeft: 10 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {items.map((item, idx) => (
                    <TouchableOpacity key={item.id} style={[styles.chip, idx === itemIdx && { backgroundColor: '#333' }]} onPress={() => setItemIdx(idx)}>
                      <Text style={[styles.chipText, { color: idx === itemIdx ? '#FFF' : theme.textHigh }]}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Money Out: Expense Category */}
          {txType === 'Money Out' && (
            <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
              <Text style={styles.pickerLabel}>Category</Text>
              <View style={styles.catGrid}>
                {EXPENSE_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catBtn, expenseCat === cat && { backgroundColor: theme.negative }]}
                    onPress={() => setExpenseCat(cat)}
                  >
                    <Text style={styles.catEmoji}>{EXPENSE_CATEGORY_EMOJI[cat]}</Text>
                    <Text style={[styles.catText, { color: expenseCat === cat ? '#FFF' : theme.textLow }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <PrimaryButton
            label={`Record ${txType}`}
            onPress={handleAddTx}
            color={txType === 'Money In' ? theme.positive : theme.negative}
          />
        </ScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, marginBottom: Spacing.md, marginTop: Spacing.md },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  fab: { paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: 20 },
  fabText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  pillRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  pill: { flex: 1, padding: Spacing.md, borderRadius: 14, alignItems: 'center' },
  pillLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  pillValue: { fontSize: 16, fontWeight: '800' },
  listContainer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowName: { fontSize: 16, fontWeight: '600', marginBottom: 3 },
  rowSub: { fontSize: 12, fontWeight: '500' },
  rowAmount: { fontSize: 18, fontWeight: '800' },
  invoiceLink: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  toggleRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg, marginTop: Spacing.sm },
  toggleBtn: { flex: 1, padding: Spacing.md, borderRadius: 12, alignItems: 'center', backgroundColor: '#F2F2F7' },
  toggleText: { fontSize: 14, fontWeight: '700' },
  pickerLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm, color: '#8E8E93' },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F2F2F7', marginRight: Spacing.sm },
  chipText: { fontSize: 14, fontWeight: '600' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F2F2F7' },
  catEmoji: { fontSize: 14 },
  catText: { fontSize: 13, fontWeight: '600' },
  pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  quickAddText: { fontSize: 12, fontWeight: '700' },
  quickAddRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quickAddBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  quickAddBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
