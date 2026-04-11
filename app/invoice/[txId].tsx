import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

export default function InvoiceScreen() {
  const { txId } = useLocalSearchParams();
  const router = useRouter();
  const theme = Colors.light;

  const identity = useOSStore(state => state.identity);
  const transactions = useOSStore(state => state.transactions);
  const items = useOSStore(state => state.items);
  const contacts = useOSStore(state => state.contacts);

  const transaction = transactions.find(t => t.id === txId);
  const contact = contacts.find(c => c.id === transaction?.contactId);
  const item = items.find(i => i.id === transaction?.itemId);

  if (!transaction || !contact || !item) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={styles.container}>
          <Text style={{ color: theme.textHigh }}>Document generation failed. Missing relation.</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: theme.primary, fontWeight: '700' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const qty = transaction.qty || 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
           <Text style={[styles.backText, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.brandGroup}>
            <Image 
               source={{ uri: identity.logoUrl }} 
               style={styles.logo} 
               resizeMode="contain" 
            />
            <View>
               <Text style={[styles.companyName, { color: theme.textHigh }]}>{identity.name}</Text>
               <Text style={[styles.taxId, { color: theme.textLow }]}>Tax ID: {identity.taxId}</Text>
            </View>
          </View>
          <Text style={[styles.invoiceTitle, { color: theme.textLow }]}>INVOICE</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.billingRow}>
          <View style={styles.billingCard}>
            <Text style={[styles.label, { color: theme.textLow }]}>Billed To:</Text>
            <Text style={[styles.customerName, { color: theme.textHigh }]}>{contact.name}</Text>
            <Text style={[styles.customerMeta, { color: theme.textLow }]}>{contact.type}</Text>
          </View>
          <View style={[styles.billingCard, { alignItems: 'flex-end' }]}>
            <Text style={[styles.label, { color: theme.textLow }]}>Transaction ID:</Text>
            <Text style={[styles.invoiceId, { color: theme.textHigh }]}>#{transaction.id.replace('tx', '')}</Text>
            <Text style={[styles.customerMeta, { color: theme.textLow, marginTop: 4 }]}>Issued: {transaction.date}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
           <Text style={[styles.label, { color: theme.textLow, flex: 3 }]}>Item</Text>
           <Text style={[styles.label, { color: theme.textLow, flex: 1, textAlign: 'center' }]}>Qty</Text>
           <Text style={[styles.label, { color: theme.textLow, flex: 1, textAlign: 'right' }]}>Amount</Text>
        </View>
        <View style={styles.tableRow}>
           <View style={{ flex: 3 }}>
              <Text style={[styles.productName, { color: theme.textHigh }]}>{item.name}</Text>
              <Text style={[styles.productSku, { color: theme.textLow }]}>{item.category}</Text>
           </View>
           <Text style={[styles.productName, { color: theme.textHigh, flex: 1, textAlign: 'center' }]}>{qty}</Text>
           <Text style={[styles.productName, { color: theme.textHigh, flex: 1, textAlign: 'right' }]}>
             ${transaction.amount.toLocaleString()}
           </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
           <Text style={[styles.totalLabel, { color: theme.textHigh }]}>Total Resolved</Text>
           <Text style={[styles.totalValue, { color: theme.primary }]}>${transaction.amount.toLocaleString()}</Text>
        </View>

        <View style={styles.signatureContainer}>
           <View style={styles.signatureLine} />
           <Text style={[styles.signatureAuth, { color: theme.textHigh }]}>{identity.signatureName}</Text>
           <Text style={[styles.signatureMeta, { color: theme.textLow }]}>Approved Digital Signature</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
  },
  backBtn: {
    marginBottom: Spacing.xl,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  brandGroup: {
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: Spacing.md,
    borderRadius: 8,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
  },
  taxId: {
    fontSize: 12,
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: Spacing.xl,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billingCard: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  customerMeta: {
    fontSize: 14,
    marginTop: 4,
  },
  invoiceId: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productSku: {
    fontSize: 12,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  totalLabel: {
    fontSize: 24,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  signatureContainer: {
    marginTop: 80,
    alignItems: 'flex-start',
  },
  signatureLine: {
    width: 200,
    height: 1,
    backgroundColor: '#000',
    marginBottom: Spacing.sm,
  },
  signatureAuth: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'serif',
    fontStyle: 'italic',
  },
  signatureMeta: {
    fontSize: 12,
    marginTop: 2,
  }
});
