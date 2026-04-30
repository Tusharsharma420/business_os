import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Plus, Package } from 'lucide-react-native';
import { Theme } from '../../constants/Theme.js';
import { apiClient } from '../../src/api/client.js';

export default function CatalogScreen() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const response = await apiClient.get('/catalog');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch catalog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Package size={20} color={Theme.colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSku}>{item.sku || 'No SKU'}</Text>
        </View>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      {item.description && (
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items in catalog</Text>
            </View>
          }
        />
      )}
      
      <TouchableOpacity style={styles.fab}>
        <Plus color="#FFF" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: '#E5F1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  itemSku: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  itemDescription: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: Theme.spacing.lg,
    bottom: Theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: Theme.colors.textSecondary,
    fontSize: 16,
  },
});
