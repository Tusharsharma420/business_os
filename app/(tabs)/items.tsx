import React, { useState } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  SafeAreaView, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';
import { BottomSheet } from '@/components/BottomSheet';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

const CATEGORIES = ['Service', 'Hardware', 'Software', 'Subscription', 'Other'];
const catEmoji: Record<string, string> = {
  Service: '⚙️', Hardware: '🖥️', Software: '💾', Subscription: '🔄', Other: '📦',
};

export default function ItemsScreen() {
  const theme = Colors.light;
  const { items, addItem, deleteItem, identity } = useOSStore();
  const cur = identity.currency;

  const [sheetVisible, setSheetVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Service');

  const handleAdd = () => {
    const parsed = parseFloat(price);
    if (!name.trim() || isNaN(parsed)) return;
    addItem({ name: name.trim(), price: parsed, category });
    setName(''); setPrice(''); setCategory('Service'); setSheetVisible(false);
  };

  const handleDelete = (id: string, iName: string) => {
    Alert.alert(`Delete "${iName}"?`, 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.textHigh }]}>Items</Text>
          <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={() => setSheetVisible(true)} activeOpacity={0.85}>
            <Text style={styles.fabText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} onLongPress={() => handleDelete(item.id, item.name)} activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{catEmoji[item.category] ?? '📦'}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={[styles.itemName, { color: theme.textHigh }]}>{item.name}</Text>
                <Text style={[styles.itemCat, { color: theme.textLow }]}>{item.category}</Text>
              </View>
              <Text style={[styles.itemPrice, { color: theme.textHigh }]}>{cur}{item.price.toLocaleString()}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} title="New Item">
        <ScrollView keyboardShouldPersistTaps="handled">
          <FormInput label="Name" value={name} onChangeText={setName} placeholder="e.g. Monthly Retainer" />
          <FormInput label="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="0.00" />
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
            <Text style={[styles.pickerLabel, { color: theme.textLow }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity key={cat} style={[styles.chip, category === cat && { backgroundColor: '#333' }]} onPress={() => setCategory(cat)}>
                  <Text style={[styles.chipText, { color: category === cat ? '#FFF' : theme.textHigh }]}>
                    {catEmoji[cat]} {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <PrimaryButton label="Save Item" onPress={handleAdd} />
        </ScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg, marginTop: Spacing.md },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  fab: { paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: 20 },
  fabText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  listContainer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22 },
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 3 },
  itemCat: { fontSize: 12, fontWeight: '500' },
  itemPrice: { fontSize: 18, fontWeight: '800' },
  pickerLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F2F2F7', marginRight: Spacing.sm },
  chipText: { fontSize: 14, fontWeight: '600' },
});
