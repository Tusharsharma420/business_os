import React, { useState } from 'react';
import {
  StyleSheet, View, Text, FlatList,
  SafeAreaView, TouchableOpacity, ScrollView, Alert, Image,
} from 'react-native';
import { AppleDesign } from '@/constants/AppleDesign';
import { useOSStore } from '@/store/useOSStore';
import { useRouter } from 'expo-router';
import { BottomSheet } from '@/components/BottomSheet';
import { FormInput } from '@/components/FormInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { AppleCard } from '@/components/AppleCard';
import { Icon } from '@/components/ui/icon';
import * as ImagePicker from 'expo-image-picker';
import { 
  Package, 
  Trash2, 
  Plus,
  LayoutGrid,
  Image as ImageIcon,
  Camera,
  ChevronRight,
  Archive,
  ShoppingBag
} from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';

const CATEGORIES = ['Hardware', 'Software', 'Service', 'Other'];

export default function ItemsScreen() {
  const router = useRouter();
  const { items, addItem, updateItem, deleteItem, identity } = useOSStore();
  const cur = identity.currency;

  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [type, setType] = useState<'product' | 'service'>('product');
  const [stock, setStock] = useState('0');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const parsedPrice = parseFloat(price);
    if (!name.trim() || isNaN(parsedPrice)) return;
    
    const itemData = { 
      name: name.trim(), 
      type,
      price: parsedPrice, 
      category, 
      stock: parseInt(stock) || 0,
      minStock: 0,
      imageUrl
    };

    if (editingId) {
      updateItem(editingId, itemData);
    } else {
      addItem(itemData);
    }

    resetForm();
  };

  const resetForm = () => {
    setName(''); setPrice(''); setCategory('Hardware'); setStock('0'); setImageUrl(undefined); 
    setEditingId(null); setSheetVisible(false); setType('product');
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setCategory(item.category);
    setStock(item.stock.toString());
    setImageUrl(item.imageUrl);
    setType(item.type);
    setSheetVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Catalog</Text>
            <Text style={styles.subtitle}>{items.length} items registered</Text>
          </View>
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => { resetForm(); setSheetVisible(true); }}
          >
            <Plus color="#fff" size={24} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const renderRightActions = () => (
              <TouchableOpacity 
                style={styles.deleteAction} 
                onPress={() => handleDelete(item.id)}
              >
                <Trash2 color="#fff" size={24} />
              </TouchableOpacity>
            );

            return (
              <Swipeable renderRightActions={renderRightActions}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <AppleCard style={styles.itemCard}>
                    <View style={styles.itemRow}>
                      {item.imageUrl ? (
                        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <Icon icon={item.type === 'product' ? ShoppingBag : LayoutGrid} size={24} color={AppleDesign.colors.text.low} />
                        </View>
                      )}
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemSub}>{item.category} &bull; {item.type}</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Text style={styles.itemPrice}>{cur}{item.price.toLocaleString()}</Text>
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

      <BottomSheet 
        visible={sheetVisible} 
        onClose={resetForm} 
        title={editingId ? "Edit Item" : "New Item"}
      >
        <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.pickedImage} />
            ) : (
              <View style={styles.imagePickerPlaceholder}>
                <Camera color={AppleDesign.colors.primary} size={32} />
                <Text style={styles.imagePickerText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeBtn, type === 'product' && styles.typeBtnActive]}
              onPress={() => setType('product')}
            >
              <Text style={[styles.typeText, type === 'product' && styles.typeTextActive]}>Product</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeBtn, type === 'service' && styles.typeBtnActive]}
              onPress={() => setType('service')}
            >
              <Text style={[styles.typeText, type === 'service' && styles.typeTextActive]}>Service</Text>
            </TouchableOpacity>
          </View>

          <FormInput label="Name" value={name} onChangeText={setName} placeholder="Item name" />
          <FormInput label="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholder="0.00" />
          
          {type === 'product' && (
            <FormInput label="Initial Stock" value={stock} onChangeText={setStock} keyboardType="number-pad" placeholder="0" />
          )}

          <View style={styles.categorySection}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.chip, category === cat && styles.chipActive]} 
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={{ marginTop: 24, gap: 12 }}>
            <PrimaryButton label="Save Changes" onPress={handleSave} />
            {editingId && (
              <TouchableOpacity style={styles.deleteLink} onPress={() => handleDelete(editingId)}>
                <Text style={styles.deleteLinkText}>Delete Item</Text>
              </TouchableOpacity>
            )}
          </View>
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
  list: {
    paddingBottom: 100,
  },
  itemCard: {
    marginBottom: 16,
    padding: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '700',
    color: AppleDesign.colors.text.high,
  },
  itemSub: {
    fontSize: 13,
    color: AppleDesign.colors.text.low,
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: AppleDesign.colors.primary,
  },
  deleteAction: {
    backgroundColor: AppleDesign.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80, // Match AppleCard height roughly
    borderRadius: 16,
    marginVertical: 4,
    marginRight: 10,
  },
  form: {
    padding: 24,
  },
  imagePickerBtn: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  imagePickerPlaceholder: {
    alignItems: 'center',
  },
  imagePickerText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppleDesign.colors.primary,
    marginTop: 8,
  },
  pickedImage: {
    width: '100%',
    height: '100%',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeBtnActive: {
    backgroundColor: '#fff',
    ...AppleDesign.shadows.subtle,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppleDesign.colors.text.low,
  },
  typeTextActive: {
    color: AppleDesign.colors.text.high,
  },
  categorySection: {
    marginTop: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: AppleDesign.colors.text.low,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
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
  deleteLink: {
    alignSelf: 'center',
    padding: 12,
  },
  deleteLinkText: {
    color: AppleDesign.colors.danger,
    fontWeight: '600',
  }
});
