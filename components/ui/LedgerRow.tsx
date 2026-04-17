import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react-native';
import { getIcon } from '@/utils/icons';

interface LedgerRowProps {
  id: string;
  amount: number;
  type: 'Money In' | 'Money Out';
  date: string;
  contactName?: string;
  itemName?: string;
  expenseCategory?: string;
  currency: string;
  onLongPress: (id: string) => void;
  onInvoicePress?: (txId: string) => void;
}

export const LedgerRow = memo(({ 
  id, amount, type, date, contactName, itemName, expenseCategory, currency, onLongPress, onInvoicePress 
}: LedgerRowProps) => {
  const theme = Colors.light;
  const isIn = type === 'Money In';
  const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const catIconName = expenseCategory ? expenseCategory.toLowerCase() : null; // simplified mapping for isolation

  return (
    <TouchableOpacity style={styles.row} onLongPress={() => onLongPress(id)} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: isIn ? '#EFFFEF' : '#FFF0EB' }]}>
        <Icon icon={isIn ? ArrowUpRight : ArrowDownLeft} size={20} color={isIn ? theme.positive : theme.negative} />
      </View>
      <View style={{ flex: 1, marginLeft: Spacing.md }}>
        <Text style={[styles.rowName, { color: theme.textHigh }]}>
          {contactName ?? 'General Entry'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.rowSub, { color: theme.textLow }]}>{displayDate}</Text>
          {expenseCategory && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.rowSub, { color: theme.textLow }]}> · </Text>
              <Text style={[styles.rowSub, { color: theme.textLow }]}>{expenseCategory}</Text>
            </View>
          )}
          {itemName && (
            <Text style={[styles.rowSub, { color: theme.textLow }]}> · {itemName}</Text>
          )}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.rowAmount, { color: isIn ? theme.positive : theme.negative }]}>
          {isIn ? '+' : '-'}{currency}{amount.toLocaleString()}
        </Text>
        {isIn && itemName && onInvoicePress && (
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
            onPress={() => onInvoicePress(id)}
          >
            <Text style={[styles.invoiceLink, { color: theme.primary }]}>Invoice</Text>
            <Icon icon={ChevronRight} size={12} color={theme.primary} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowName: { fontSize: 16, fontWeight: '600', marginBottom: 3 },
  rowSub: { fontSize: 12, fontWeight: '500' },
  rowAmount: { fontSize: 18, fontWeight: '800' },
  invoiceLink: { fontSize: 12, fontWeight: '700' },
});
