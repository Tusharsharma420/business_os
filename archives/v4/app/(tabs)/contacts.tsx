import React, { useState } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  SafeAreaView, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppleDesign } from '@/constants/AppleDesign';
import { useOSStore, Contact } from '@/store/useOSStore';
import { BottomSheet } from '@/components/BottomSheet';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AppleCard } from '@/components/AppleCard';
import { Icon } from '@/components/ui/icon';
import { 
  Plus, 
  Search,
  ChevronRight, 
  Users,
  MessageCircle,
  Phone,
  MoreVertical,
  UserPlus,
  Trash2
} from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';

type ContactType = Contact['type'];
const CONTACT_TYPES: ContactType[] = ['Customer', 'Vendor', 'Partner', 'Other'];

export default function ContactsScreen() {
  const router = useRouter();
  const { contacts, transactions, addContact, updateContact, deleteContact, identity } = useOSStore();
  const cur = identity.currency;

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<ContactType>('Customer');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId) {
      updateContact(editingId, { name: name.trim(), type: selectedType });
    } else {
      addContact({ name: name.trim(), type: selectedType });
    }
    resetForm();
  };

  const resetForm = () => {
    setName(''); setSelectedType('Customer'); setEditingId(null); setSheetVisible(false);
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setSelectedType(contact.type);
    setSheetVisible(true);
  };

  const handleDelete = (id: string, cName: string) => {
    Alert.alert(`Remove "${cName}"?`, 'This will delete the contact from your list.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteContact(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>People</Text>
            <Text style={styles.subtitle}>{contacts.length} connections</Text>
          </View>
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => setSheetVisible(true)}
          >
            <UserPlus color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color={AppleDesign.colors.text.low} />
          <FormInput 
            placeholder="Search contacts..." 
            value={searchQuery} 
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
            hideLabel
          />
        </View>

        <FlatList
          data={filteredContacts}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const txCount = transactions.filter(t => t.contactId === item.id).length;
            const balance = transactions
              .filter(t => t.contactId === item.id)
              .reduce((s, t) => s + (t.type === 'Money In' ? t.amount : -t.amount), 0);

            const renderRightActions = () => (
              <TouchableOpacity 
                style={styles.deleteAction} 
                onPress={() => handleDelete(item.id, item.name)}
              >
                <Trash2 color="#fff" size={24} />
              </TouchableOpacity>
            );

            return (
              <Swipeable renderRightActions={renderRightActions}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleEdit(item)}
                >
                  <AppleCard style={styles.contactCard}>
                    <View style={styles.cardRow}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                      </View>
                      <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.typeText}>{item.type} &bull; {txCount} txs</Text>
                      </View>
                      <View style={styles.balanceCol}>
                        <Text style={[styles.balance, { color: balance >= 0 ? '#2E7D32' : '#C62828' }]}>
                          {cur}{Math.abs(balance).toLocaleString()}
                        </Text>
                        <ChevronRight size={16} color={AppleDesign.colors.text.low} />
                      </View>
                    </View>
                  </AppleCard>
                </TouchableOpacity>
              </Swipeable>
            );
          }}
        />
      </View>

      <BottomSheet visible={sheetVisible} onClose={resetForm} title={editingId ? "Edit Contact" : "New Contact"}>
        <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
          <FormInput label="Name" value={name} onChangeText={setName} placeholder="John Doe" />
          
          <View style={styles.typeSection}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.typeGrid}>
              {CONTACT_TYPES.map(type => (
                <TouchableOpacity 
                  key={type} 
                  style={[styles.typeChip, selectedType === type && styles.typeChipActive]} 
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[styles.typeChipText, selectedType === type && styles.typeChipTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <PrimaryButton label={editingId ? "Save Changes" : "Create Contact"} onPress={handleSave} />
          <View style={{ height: 40 }} />
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingVertical: 10,
  },
  list: {
    paddingBottom: 100,
  },
  contactCard: {
    marginBottom: 16,
    padding: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: AppleDesign.colors.primary,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: AppleDesign.colors.text.high,
  },
  typeText: {
    fontSize: 13,
    color: AppleDesign.colors.text.low,
    marginTop: 2,
  },
  balanceCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
  },
  deleteAction: {
    backgroundColor: AppleDesign.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 74, // Match contactCard height roughly
    borderRadius: 16,
    marginVertical: 4,
    marginRight: 10,
  },
  form: {
    padding: 24,
  },
  typeSection: {
    marginVertical: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: AppleDesign.colors.text.low,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  typeChipActive: {
    backgroundColor: AppleDesign.colors.primary,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppleDesign.colors.text.high,
  },
  typeChipTextActive: {
    color: '#fff',
  }
});
