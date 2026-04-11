import React, { useState } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  SafeAreaView, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore, Contact } from '@/store/useOSStore';
import { BottomSheet } from '@/components/BottomSheet';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';

type ContactType = Contact['type'];
const CONTACT_TYPES: ContactType[] = ['Customer', 'Vendor', 'Partner', 'Other'];
const typeColor: Record<ContactType, string> = {
  Customer: '#00C805',
  Vendor: '#007AFF',
  Partner: '#FF9500',
  Other: '#8E8E93',
};

export default function ContactsScreen() {
  const theme = Colors.light;
  const router = useRouter();
  const { contacts, transactions, addContact, deleteContact, identity } = useOSStore();
  const cur = identity.currency;

  const [sheetVisible, setSheetVisible] = useState(false);
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<ContactType>('Customer');

  const handleAdd = () => {
    if (!name.trim()) return;
    addContact({ name: name.trim(), type: selectedType });
    setName(''); setSelectedType('Customer'); setSheetVisible(false);
  };

  const handleDelete = (id: string, cName: string) => {
    Alert.alert(`Delete "${cName}"?`, 'This will not delete their transactions.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          try {
            deleteContact(id);
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
          <Text style={[styles.title, { color: theme.textHigh }]}>Contacts</Text>
          <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={() => setSheetVisible(true)} activeOpacity={0.85}>
            <Text style={styles.fabText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={contacts}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => {
            const txCount = transactions.filter(t => t.contactId === item.id).length;
            const totalValue = transactions.filter(t => t.contactId === item.id && t.type === 'Money In').reduce((s, t) => s + t.amount, 0);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push({ pathname: '/contact/[contactId]', params: { contactId: item.id } })}
                onLongPress={() => handleDelete(item.id, item.name)}
                activeOpacity={0.7}
              >
                <View style={[styles.avatar, { backgroundColor: typeColor[item.type] + '20' }]}>
                  <Text style={[styles.avatarText, { color: typeColor[item.type] }]}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <Text style={[styles.cardName, { color: theme.textHigh }]}>{item.name}</Text>
                  <Text style={[styles.cardSub, { color: theme.textLow }]}>
                    {txCount} transaction{txCount !== 1 ? 's' : ''}
                    {totalValue > 0 ? ` · ${cur}${totalValue.toLocaleString()}` : ''}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: typeColor[item.type] + '15' }]}>
                  <Text style={[styles.badgeText, { color: typeColor[item.type] }]}>{item.type}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} title="New Contact">
        <ScrollView keyboardShouldPersistTaps="handled">
          <FormInput label="Name" value={name} onChangeText={setName} placeholder="e.g. Acme Corporation" autoCapitalize="words" />
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.md }}>
            <Text style={[styles.pickerLabel, { color: theme.textLow }]}>Type</Text>
            <View style={styles.typeGrid}>
              {CONTACT_TYPES.map(type => (
                <TouchableOpacity key={type} style={[styles.typeBtn, selectedType === type && { backgroundColor: typeColor[type] }]} onPress={() => setSelectedType(type)}>
                  <Text style={[styles.typeBtnText, { color: selectedType === type ? '#FFF' : theme.textLow }]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <PrimaryButton label="Save Contact" onPress={handleAdd} />
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
  card: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800' },
  cardName: { fontSize: 16, fontWeight: '600', marginBottom: 3 },
  cardSub: { fontSize: 13, fontWeight: '500' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  pickerLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeBtn: { paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: 20, backgroundColor: '#F2F2F7' },
  typeBtnText: { fontSize: 14, fontWeight: '600' },
});
