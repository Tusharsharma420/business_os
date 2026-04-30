import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, View, Text, FlatList, SafeAreaView, 
  TouchableOpacity, ScrollView, Alert 
} from 'react-native';
import { AppleDesign } from '@/constants/AppleDesign';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BottomSheet } from '@/components/BottomSheet';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AppleCard } from '@/components/AppleCard';
import { Icon } from '@/components/ui/icon';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  X, 
  Trash2, 
  ChevronRight,
  ShoppingBag,
  History,
  Tag,
  Percent,
  ReceiptText
} from 'lucide-react-native';

import { useTransactionLogic } from '@/hooks/useTransactionLogic';

export default function TransactionsScreen() {
  const router = useRouter();
  const { contactId, add } = useLocalSearchParams();
  const { state, actions } = useTransactionLogic(contactId as string, add as string);

  useEffect(() => {
    if (contactId) {
       actions.setContactId(contactId as string);
       actions.setSheetVisible(true);
    } else if (add === 'true') {
       actions.setSheetVisible(true);
    }
  }, [contactId, add]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Ledger</Text>
            <Text style={styles.subtitle}>Manage your cash flow</Text>
          </View>
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => actions.setSheetVisible(true)}
          >
            <Plus color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        {/* Financial Summary */}
        <View style={styles.summaryRow}>
           <AppleCard style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>INCOME</Text>
              <Text style={[styles.summaryValue, { color: '#2E7D32' }]}>{state.cur}{state.totalIn.toLocaleString()}</Text>
           </AppleCard>
           <AppleCard style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>EXPENSE</Text>
              <Text style={[styles.summaryValue, { color: '#C62828' }]}>{state.cur}{state.totalOut.toLocaleString()}</Text>
           </AppleCard>
        </View>

        <FlatList
          data={state.transactions}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const contact = state.contacts.find(c => c.id === item.contactId);
            const isIn = item.type === 'Money In';
            return (
              <TouchableOpacity 
                onPress={() => router.push({ pathname: '/invoice/[txId]', params: { txId: item.id } })}
                onLongPress={() => actions.handleDelete(item.id)}
              >
                <AppleCard style={styles.txCard}>
                  <View style={styles.txRow}>
                    <View style={[styles.txIcon, { backgroundColor: isIn ? '#E8F5E9' : '#FFEBEE' }]}>
                      <Icon icon={isIn ? ArrowDownLeft : ArrowUpRight} size={20} color={isIn ? '#2E7D32' : '#C62828'} />
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txName}>{contact?.name ?? 'Business Transaction'}</Text>
                      <Text style={styles.txDate}>
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {item.lineItems.length > 0 ? ` • ${item.lineItems.length} items` : ''}
                      </Text>
                    </View>
                    <View style={styles.txAmtCol}>
                      <Text style={[styles.txAmount, { color: isIn ? '#2E7D32' : '#C62828' }]}>
                        {isIn ? '+' : '-'}{state.cur}{item.amount.toLocaleString()}
                      </Text>
                      <ChevronRight size={14} color={AppleDesign.colors.text.low} />
                    </View>
                  </View>
                </AppleCard>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <BottomSheet 
        visible={state.sheetVisible} 
        onClose={actions.resetForm} 
        title="Record Transaction"
      >
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeBtn, state.txType === 'Money In' && styles.typeInActive]}
              onPress={() => actions.setTxType('Money In')}
            >
              <Text style={[styles.typeText, state.txType === 'Money In' && styles.typeTextActive]}>INCOME</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeBtn, state.txType === 'Money Out' && styles.typeOutActive]}
              onPress={() => actions.setTxType('Money Out')}
            >
              <Text style={[styles.typeText, state.txType === 'Money Out' && styles.typeTextActive]}>EXPENSE</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Picker */}
          <Text style={styles.label}>Contact</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
             {state.contacts.map(c => (
               <TouchableOpacity 
                 key={c.id} 
                 style={[styles.chip, state.contactId === c.id && styles.chipActive]} 
                 onPress={() => actions.setContactId(c.id)}
               >
                 <Text style={[styles.chipText, state.contactId === c.id && styles.chipTextActive]}>{c.name}</Text>
               </TouchableOpacity>
             ))}
          </ScrollView>

          {state.txType === 'Money In' ? (
            <>
              {/* Item Selection */}
              <View style={styles.sectionHeader}>
                <Text style={styles.label}>Items</Text>
                <Text style={styles.subtotal}>{state.cur}{state.subtotal.toLocaleString()}</Text>
              </View>

              {state.lineItems.map(li => (
                <View key={li.itemId} style={styles.lineItem}>
                   <View style={styles.liInfo}>
                      <Text style={styles.liName}>{li.name}</Text>
                      <Text style={styles.liPrice}>{state.cur}{li.price} x {li.qty}</Text>
                   </View>
                   <View style={styles.qtyControls}>
                      <TouchableOpacity onPress={() => actions.updateLineItemQty(li.itemId, li.qty - 1)} style={styles.qtyBtn}>
                        <Text style={styles.qtyBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{li.qty}</Text>
                      <TouchableOpacity onPress={() => actions.updateLineItemQty(li.itemId, li.qty + 1)} style={styles.qtyBtn}>
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                   </View>
                </View>
              ))}

              <Text style={styles.label}>Select Item to Add</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                 {state.items.map(item => (
                   <TouchableOpacity 
                     key={item.id} 
                     style={styles.itemChip} 
                     onPress={() => actions.addLineItem(item.id)}
                   >
                     <ShoppingBag size={14} color={AppleDesign.colors.primary} />
                     <Text style={styles.itemChipText}>{item.name}</Text>
                   </TouchableOpacity>
                 ))}
              </ScrollView>

              {/* Financial Modifiers */}
              <View style={styles.modifierRow}>
                 <View style={{ flex: 1 }}>
                    <FormInput 
                      label="Discount" 
                      value={state.globalDiscount.toString()} 
                      onChangeText={(v) => actions.setGlobalDiscount(parseFloat(v) || 0)} 
                      keyboardType="decimal-pad" 
                      placeholder="0.00"
                    />
                 </View>
                 <View style={{ flex: 1 }}>
                    <FormInput 
                      label="Tax" 
                      value={state.globalTax.toString()} 
                      onChangeText={(v) => actions.setGlobalTax(parseFloat(v) || 0)} 
                      keyboardType="decimal-pad" 
                      placeholder="0.00"
                    />
                 </View>
              </View>
            </>
          ) : (
            <FormInput 
              label={`Expense Amount (${state.cur})`} 
              value={state.subtotal.toString()} 
              onChangeText={(v) => actions.updateLineItemQty('expense', parseFloat(v) || 0)} 
              keyboardType="decimal-pad" 
              placeholder="0.00" 
            />
          )}

          <FormInput label="Note" value={state.note} onChangeText={actions.setNote} placeholder="Internal note..." />

          {/* Grand Total Bar */}
          <View style={styles.totalBar}>
             <View>
                <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                <Text style={styles.totalValue}>{state.cur}{state.total.toLocaleString()}</Text>
             </View>
             <PrimaryButton 
               label="Confirm" 
               onPress={actions.handleAddTx} 
               containerStyle={styles.confirmBtn}
             />
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppleDesign.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: AppleDesign.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    ...AppleDesign.typography.h1,
    color: AppleDesign.colors.text.high,
  },
  subtitle: {
    ...AppleDesign.typography.caption,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppleDesign.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppleDesign.shadows.floating,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: AppleDesign.colors.text.low,
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  list: {
    paddingBottom: 100,
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
  form: {
    padding: 24,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeInActive: {
    backgroundColor: '#fff',
    ...AppleDesign.shadows.subtle,
  },
  typeOutActive: {
    backgroundColor: '#fff',
    ...AppleDesign.shadows.subtle,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '800',
    color: AppleDesign.colors.text.low,
  },
  typeTextActive: {
    color: AppleDesign.colors.text.high,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: AppleDesign.colors.text.low,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  chipScroll: {
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: AppleDesign.colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppleDesign.colors.text.high,
  },
  chipTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: '700',
    color: AppleDesign.colors.text.high,
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  liInfo: {
    flex: 1,
  },
  liName: {
    fontSize: 15,
    fontWeight: '700',
    color: AppleDesign.colors.text.high,
  },
  liPrice: {
    fontSize: 13,
    color: AppleDesign.colors.text.low,
    marginTop: 2,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    gap: 12,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    marginRight: 8,
  },
  itemChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modifierRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 20,
    marginTop: 24,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  confirmBtn: {
    width: 120,
    marginBottom: 0,
  }
});
