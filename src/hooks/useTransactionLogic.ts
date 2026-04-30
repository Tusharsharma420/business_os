import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useOSStore } from '@/store/useOSStore';
import type { ExpenseCategory, LineItem } from '@/store/useOSStore';

type TxType = 'Money In' | 'Money Out';

export function useTransactionLogic(contactIdParam?: string, addParam?: string) {
  const { 
    transactions, contacts, items, 
    addTransaction, deleteTransaction, 
    addContact, identity 
  } = useOSStore();
  
  const cur = identity.currency;

  const [sheetVisible, setSheetVisible] = useState(false);
  const [txType, setTxType] = useState<TxType>('Money In');
  const [note, setNote] = useState('');
  const [contactId, setContactId] = useState<string | undefined>(contactIdParam);
  const [expenseCat, setExpenseCat] = useState<ExpenseCategory>('Other');
  
  // Multi-item state
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [globalTax, setGlobalTax] = useState(0);

  const subtotal = useMemo(() => 
    lineItems.reduce((sum, item) => sum + (item.price * item.qty), 0), 
  [lineItems]);

  const total = useMemo(() => {
    const afterDiscount = subtotal - globalDiscount;
    return afterDiscount + globalTax;
  }, [subtotal, globalDiscount, globalTax]);

  const totalIn = useMemo(() => 
    transactions.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0), 
  [transactions]);

  const totalOut = useMemo(() => 
    transactions.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0), 
  [transactions]);

  const addLineItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    setLineItems(prev => {
      const existing = prev.find(li => li.itemId === itemId);
      if (existing) {
        return prev.map(li => li.itemId === itemId ? { ...li, qty: li.qty + 1 } : li);
      }
      return [...prev, { 
        itemId: item.id, 
        name: item.name, 
        qty: 1, 
        price: item.price,
        tax: 0,
        discount: 0
      }];
    });
  };

  const removeLineItem = (itemId: string) => {
    setLineItems(prev => prev.filter(li => li.itemId !== itemId));
  };

  const updateLineItemQty = (itemId: string, qty: number) => {
    if (qty < 1) return removeLineItem(itemId);
    setLineItems(prev => prev.map(li => li.itemId === itemId ? { ...li, qty } : li));
  };

  const handleAddTx = useCallback(() => {
    if (txType === 'Money In' && lineItems.length === 0) {
      Alert.alert('Empty Order', 'Please add at least one item.');
      return;
    }

    // For Money Out, we might just have a total amount and category
    // In this lean version, we handle both.
    const finalAmount = txType === 'Money In' ? total : (subtotal || 0);

    addTransaction({
      date: new Date().toISOString(),
      type: txType,
      amount: finalAmount,
      contactId,
      lineItems,
      tax: globalTax,
      discount: globalDiscount,
      status: 'paid',
      note: note.trim() || undefined,
      expenseCategory: txType === 'Money Out' ? expenseCat : undefined,
    });

    resetForm();
  }, [total, subtotal, txType, contactId, lineItems, note, expenseCat, globalDiscount, globalTax]);

  const resetForm = () => {
    setLineItems([]);
    setGlobalDiscount(0);
    setGlobalTax(0);
    setNote('');
    setSheetVisible(false);
    setTxType('Money In');
  };

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete Transaction', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  }, [deleteTransaction]);

  return {
    state: {
      transactions, contacts, items, cur, sheetVisible, txType, note, contactId, expenseCat,
      lineItems, subtotal, total, globalDiscount, globalTax, totalIn, totalOut
    },
    actions: {
      setSheetVisible, setTxType, setNote, setContactId, setExpenseCat,
      addLineItem, removeLineItem, updateLineItemQty, setGlobalDiscount, setGlobalTax,
      handleAddTx, handleDelete, resetForm
    }
  };
}
