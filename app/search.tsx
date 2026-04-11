import React, { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, TextInput,
  FlatList, SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore, EXPENSE_CATEGORY_EMOJI } from '@/store/useOSStore';

type ResultType = 'transaction' | 'contact' | 'item';
interface Result {
  type: ResultType;
  id: string;
  title: string;
  subtitle: string;
  right?: string;
  rightColor?: string;
}

export default function SearchScreen() {
  const theme = Colors.light;
  const router = useRouter();
  const { transactions, contacts, items, identity } = useOSStore();
  const cur = identity.currency;
  const [query, setQuery] = useState('');

  const results: Result[] = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const out: Result[] = [];

    // Transactions
    transactions.forEach(tx => {
      const contact = contacts.find(c => c.id === tx.contactId);
      const item = items.find(i => i.id === tx.itemId);
      const haystack = [contact?.name ?? '', item?.name ?? '', tx.note ?? '', tx.expenseCategory ?? '', tx.date].join(' ').toLowerCase();
      if (haystack.includes(q)) {
        const isIn = tx.type === 'Money In';
        out.push({
          type: 'transaction',
          id: tx.id,
          title: contact?.name ?? 'General Entry',
          subtitle: `${tx.date}${item ? ' · ' + item.name : ''}${tx.note ? ' · ' + tx.note : ''}`,
          right: `${isIn ? '+' : '-'}${cur}${tx.amount.toLocaleString()}`,
          rightColor: isIn ? theme.positive : theme.negative,
        });
      }
    });

    // Contacts
    contacts.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)) {
        const txCount = transactions.filter(t => t.contactId === c.id).length;
        out.push({
          type: 'contact',
          id: c.id,
          title: c.name,
          subtitle: `${c.type} · ${txCount} transaction${txCount !== 1 ? 's' : ''}`,
        });
      }
    });

    // Items
    items.forEach(i => {
      if (i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)) {
        out.push({
          type: 'item',
          id: i.id,
          title: i.name,
          subtitle: i.category,
          right: `${cur}${i.price.toLocaleString()}`,
          rightColor: theme.textHigh,
        });
      }
    });

    return out;
  }, [query, transactions, contacts, items]);

  const typeIcon: Record<ResultType, string> = {
    transaction: '💸',
    contact: '👤',
    item: '📦',
  };

  const handlePress = (result: Result) => {
    if (result.type === 'contact') {
      router.push({ pathname: '/contact/[contactId]', params: { contactId: result.id } });
    } else if (result.type === 'transaction') {
      router.push('/(tabs)/transactions');
    } else if (result.type === 'item') {
      router.push('/(tabs)/items');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchBarRow}>
          <View style={[styles.searchBar, { backgroundColor: '#F2F2F7' }]}>
            <Text style={styles.searchBarIcon}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: theme.textHigh }]}
              value={query}
              onChangeText={setQuery}
              placeholder="Search transactions, contacts, items..."
              placeholderTextColor={theme.textLow}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Text style={[styles.clearBtn, { color: theme.textLow }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: theme.primary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        {query.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: theme.textHigh }]}>Search Everything</Text>
            <Text style={[styles.emptySub, { color: theme.textLow }]}>Transactions · Contacts · Items</Text>
          </View>
        )}

        {/* No results */}
        {query.length > 0 && results.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>😶</Text>
            <Text style={[styles.emptyTitle, { color: theme.textHigh }]}>No results for "{query}"</Text>
          </View>
        )}

        {/* Results */}
        <FlatList
          data={results}
          keyExtractor={(item, idx) => `${item.type}-${item.id}-${idx}`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultRow} onPress={() => handlePress(item)} activeOpacity={0.7}>
              <View style={[styles.resultIcon, { backgroundColor: '#F2F2F7' }]}>
                <Text style={styles.resultIconText}>{typeIcon[item.type]}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.resultTitle, { color: theme.textHigh }]}>{item.title}</Text>
                <Text style={[styles.resultSub, { color: theme.textLow }]} numberOfLines={1}>{item.subtitle}</Text>
              </View>
              {item.right && (
                <Text style={[styles.resultRight, { color: item.rightColor ?? theme.textHigh }]}>{item.right}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Spacing.md },
  searchBarRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg, gap: Spacing.sm },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 12, height: 48 },
  searchBarIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '500' },
  clearBtn: { fontSize: 14, fontWeight: '600', paddingHorizontal: 4 },
  cancelBtn: { paddingVertical: 8 },
  cancelText: { fontSize: 15, fontWeight: '600' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 15, fontWeight: '500' },
  listContainer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  resultRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  resultIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resultIconText: { fontSize: 18 },
  resultTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  resultSub: { fontSize: 13, fontWeight: '500' },
  resultRight: { fontSize: 15, fontWeight: '800', marginLeft: 8 },
});
