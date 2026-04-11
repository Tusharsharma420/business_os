import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';
import { useRouter } from 'expo-router';

export default function TransactionsScreen() {
  const theme = Colors.light;
  const router = useRouter();
  const transactions = useOSStore(state => state.transactions);
  const contacts = useOSStore(state => state.contacts);
  const items = useOSStore(state => state.items);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>Transactions</Text>
        
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const contact = contacts.find(c => c.id === item.contactId);
            const product = items.find(i => i.id === item.itemId);
            const isIncome = item.type === 'Money In';

            return (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: theme.textHigh }]}>
                    {contact ? contact.name : 'Unknown Entry'}
                  </Text>
                  <Text style={[styles.date, { color: theme.textLow }]}>
                    {item.date} {product && `• ${product.name}`}
                  </Text>
                </View>
                
                <View style={{ alignItems: 'flex-end' }}>
                   <Text style={[
                     styles.amount,
                     { color: isIncome ? theme.positive : theme.textHigh }
                   ]}>
                     {isIncome ? '+' : '-'}${Math.abs(item.amount).toLocaleString()}
                   </Text>
                   
                   {isIncome && product && (
                     <TouchableOpacity 
                       style={styles.invoiceBtn} 
                       onPress={() => router.push({ pathname: '/invoice/[txId]', params: { txId: item.id } })}
                     >
                       <Text style={[styles.invoiceBtnText, { color: theme.primary }]}>View Invoice</Text>
                     </TouchableOpacity>
                   )}
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  invoiceBtn: {
    marginTop: 4,
    paddingVertical: 4,
  },
  invoiceBtnText: {
    fontSize: 12,
    fontWeight: '700',
  }
});
