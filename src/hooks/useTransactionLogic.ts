import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useOSStore } from '@/store/useOSStore';
import type { ExpenseCategory } from '@/store/useOSStore';

type TxType = 'Money In' | 'Money Out';

export function useTransactionLogic(contactIdParam?: string, addParam?: string) {
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

  const totalIn = transactions.filter(t => t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'Money Out').reduce((s, t) => s + t.amount, 0);

  const handleAddTx = useCallback(() => {
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
  }, [amount, txType, contactIdx, itemIdx, note, expenseCat, contacts, items]);

  const handleQuickAddContact = useCallback(() => {
    if (!newContactName.trim()) return;
    addContact({ name: newContactName.trim(), type: 'Customer' });
    setNewContactName('');
    setIsAddingContact(false);
    setContactIdx(contacts.length);
  }, [newContactName, contacts.length]);

  const handleQuickAddItem = useCallback(() => {
    if (newItemName.trim()) {
      addItem({ name: newItemName.trim(), type: 'product', price: parseFloat(amount) || 0, category: 'Hardware', stock: 0, minStock: 0 });
      setNewItemName('');
      setIsAddingItem(false);
    }
    setItemIdx(items.length);
  }, [newItemName, amount, items.length]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete Transaction', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) },
    ]);
  }, [deleteTransaction]);

  return {
    state: {
      transactions, contacts, items, cur, sheetVisible, txType, amount, note, contactIdx, itemIdx, expenseCat,
      isAddingContact, newContactName, isAddingItem, newItemName, totalIn, totalOut
    },
    actions: {
      setSheetVisible, setTxType, setAmount, setNote, setContactIdx, setItemIdx, setExpenseCat,
      setIsAddingContact, setNewContactName, setIsAddingItem, setNewItemName,
      handleAddTx, handleQuickAddContact, handleQuickAddItem, handleDelete
    }
  };
}
