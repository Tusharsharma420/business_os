import React, { useState } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  SafeAreaView, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';
import { useRouter } from 'expo-router';
import { BottomSheet } from '@/components/BottomSheet';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

const CATEGORIES = ['Service', 'Hardware', 'Software', 'Subscription', 'Other'];
const catEmoji: Record<string, string> = {
  Service: '⚙️', Hardware: '🖥️', Software: '💾', Subscription: '🔄', Other: '📦',
};

export default function ItemsScreen() {
  const theme = Colors.light;
  const router = useRouter();
  const { items, addItem, deleteItem, identity } = useOSStore();
  const cur = identity.currency;

  const [sheetVisible, setSheetVisible] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Service');
  const [stock, setStock] = useState('0');
  const [minStock, setMinStock] = useState('0');

  const handleAdd = () => {
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);
    const parsedMin = parseInt(minStock);
    if (!name.trim() || isNaN(parsedPrice)) return;
    
    addItem({ 
      name: name.trim(), 
      price: parsedPrice, 
      category, 
      stock: isNaN(parsedStock) ? 0 : parsedStock,
      minStock: isNaN(parsedMin) ? 0 : parsedMin 
    });

    setName(''); setPrice(''); setCategory('Service'); setStock('0'); setMinStock('0'); setSheetVisible(false);
  };

  const handleDelete = (id: string, iName: string) => {
    Alert.alert(`Delete "${iName}"?`, 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          try {
            deleteItem(id);
          } catch (e: any) {
            Alert.alert('Cannot Delete', e.message);
          }
        } 
      },
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
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{catEmoji[item.category] ?? '📦'}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: Spacing.md }}>
                <Text style={[styles.itemName, { color: theme.textHigh }]}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.itemCat, { color: theme.textLow }]}>{item.category} · </Text>
                  <Text style={[
                    styles.stockLabel, 
                    { color: item.stock <= item.minStock ? theme.negative : theme.textLow }
                  ]}>
                    Stock: {item.stock}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.itemPrice, { color: theme.textHigh }]}>{cur}{item.price.toLocaleString()}</Text>
                <TouchableOpacity 
                  style={[styles.itemRecordBtn, { backgroundColor: '#333' }]}
                  onPress={() => router.push({ pathname: '/(tabs)/transactions', params: { add: 'true' } })}
                >
                  <Text style={styles.itemRecordText}>+ Record</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.deleteBtn}>
                <Text style={{ fontSize: 14 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} title="New Item">
        <ScrollView keyboardShouldPersistTaps="handled">
          <FormInput label="Name" value={name} onChangeText={setName} placeholder="e.g. Monthly Retainer" />
          <FormInput label="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="0.00" />
          
          <View style={{ flexDirection: 'row', gap: Spacing.md }}>
            <FormInput 
              label="Initially in Stock" 
              value={stock} 
              onChangeText={setStock} 
              keyboardType="number-pad" 
              placeholder="0" 
              containerStyle={{ flex: 1 }}
            />
            <FormInput 
              label="Min Stock Alert" 
              value={minStock} 
              onChangeText={setMinStock} 
              keyboardType="number-pad" 
              placeholder="0" 
              containerStyle={{ flex: 1 }}
            />
          </View>
          
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
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  itemCat: { fontSize: 13, fontWeight: '500' },
  stockLabel: { fontSize: 13, fontWeight: '700' },
  itemPrice: { fontSize: 16, fontWeight: '800' },
  itemRecordBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginTop: 4 },
  itemRecordText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  deleteBtn: { marginLeft: 16, padding: 8 },
  pickerLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F2F2F7', marginRight: Spacing.sm },
  chipText: { fontSize: 14, fontWeight: '600' },
});
