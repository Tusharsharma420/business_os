import React from 'react';
import {
  StyleSheet, View, Text, SafeAreaView,
  ScrollView, Image, TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';
import { PdfGenerator } from '@/utils/pdfGenerator';

export default function InvoiceScreen() {
  const { txId } = useLocalSearchParams();
  const router = useRouter();
  const theme = Colors.light;
  const { identity, transactions, items, contacts } = useOSStore();
  const cur = identity.currency;

  const tx = transactions.find(t => t.id === txId);
  const contact = contacts.find(c => c.id === tx?.contactId) ?? { name: 'Unknown Client', type: 'Other' as const, id: 'unknown' };
  const item = items.find(i => i.id === tx?.itemId) ?? { 
    id: 'unknown',
    name: tx?.note || 'Professional Services', 
    price: tx?.amount || 0, 
    category: 'General',
    stock: 0,
    minStock: 0
  };

  if (!tx) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 40 }}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: theme.textHigh }]}>Invoice Not Found</Text>
          <Text style={[styles.errorSub, { color: theme.textLow }]}>Transaction record is missing.</Text>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backPill, { backgroundColor: theme.primary }]}>
            <Text style={styles.backPillText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await PdfGenerator.generateInvoice(tx, item as any, contact as any, identity);
    } catch (e) {
      console.error(e);
    }
  };

  const qty = tx.qty ?? 1;
  const unitPrice = item.price;
  const subtotal = unitPrice * qty;
  const taxRate = identity.taxRate / 100;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  const invoiceNum = `INV-${tx.id.replace('tx_', '').replace('tx', '').padStart(6, '0')}`;
  const issueDate = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.primary }]}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={[styles.shareBtn, { backgroundColor: '#333' }]}>
            <Text style={styles.backBtnText}>Share PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Paper */}
        <View style={styles.paper}>

          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.brandLeft}>
              <Image source={{ uri: identity.logoUrl }} style={styles.logo} resizeMode="contain" />
              <Text style={[styles.companyName, { color: theme.textHigh }]}>{identity.name}</Text>
              {identity.taxId ? <Text style={[styles.taxId, { color: theme.textLow }]}>Tax ID: {identity.taxId}</Text> : null}
              {identity.address ? <Text style={[styles.addr, { color: theme.textLow }]}>{identity.address}</Text> : null}
              {identity.email ? <Text style={[styles.addr, { color: theme.textLow }]}>{identity.email}</Text> : null}
            </View>
            <View style={styles.brandRight}>
              <Text style={styles.invoiceWordmark}>INVOICE</Text>
              <Text style={[styles.invoiceNum, { color: theme.textHigh }]}>{invoiceNum}</Text>
              <Text style={[styles.invoiceMeta, { color: theme.textLow }]}>Issued: {issueDate}</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#E8FAE8' }]}>
                <Text style={[styles.statusText, { color: theme.positive }]}>● Paid</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Bill To */}
          <View style={styles.billRow}>
            <View style={styles.billCard}>
              <Text style={[styles.billLabel, { color: theme.textLow }]}>Bill To</Text>
              <Text style={[styles.billName, { color: theme.textHigh }]}>{contact.name}</Text>
              <Text style={[styles.billSub, { color: theme.textLow }]}>{contact.type}</Text>
            </View>
            <View style={[styles.billCard, { alignItems: 'flex-end' }]}>
              <Text style={[styles.billLabel, { color: theme.textLow }]}>Due Date</Text>
              <Text style={[styles.billName, { color: theme.textHigh }]}>{issueDate}</Text>
              <Text style={[styles.billSub, { color: theme.positive }]}>Settled</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Line Items Table Header */}
          <View style={styles.tableHead}>
            <Text style={[styles.th, { flex: 3, color: theme.textLow }]}>Description</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'center', color: theme.textLow }]}>Qty</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right', color: theme.textLow }]}>Unit</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right', color: theme.textLow }]}>Total</Text>
          </View>

          {/* Line Item Row */}
          <View style={[styles.tableRow, { borderBottomColor: '#EBEBEB' }]}>
            <View style={{ flex: 3 }}>
              <Text style={[styles.tdMain, { color: theme.textHigh }]}>{item.name}</Text>
              <Text style={[styles.tdSub, { color: theme.textLow }]}>{item.category}</Text>
              {tx.note && <Text style={[styles.tdSub, { color: theme.textLow }]}>{tx.note}</Text>}
            </View>
            <Text style={[styles.td, { flex: 1, textAlign: 'center', color: theme.textHigh }]}>{qty}</Text>
            <Text style={[styles.td, { flex: 1, textAlign: 'right', color: theme.textHigh }]}>{cur}{unitPrice.toLocaleString()}</Text>
            <Text style={[styles.td, { flex: 1, textAlign: 'right', color: theme.textHigh }]}>{cur}{subtotal.toLocaleString()}</Text>
          </View>

          {/* Subtotals */}
          <View style={styles.subtotalBlock}>
            <View style={styles.subtotalRow}>
              <Text style={[styles.subtotalLabel, { color: theme.textLow }]}>Subtotal</Text>
              <Text style={[styles.subtotalValue, { color: theme.textHigh }]}>{cur}{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.subtotalRow}>
              <Text style={[styles.subtotalLabel, { color: theme.textLow }]}>Tax ({identity.taxRate}%)</Text>
              <Text style={[styles.subtotalValue, { color: theme.textHigh }]}>{cur}{taxAmount.toFixed(2)}</Text>
            </View>
            <View style={[styles.subtotalRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: theme.textHigh }]}>Total Due</Text>
              <Text style={[styles.totalValue, { color: theme.positive }]}>{cur}{total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Signature */}
          <View style={styles.sigRow}>
            <View>
              <View style={styles.sigLine} />
              <Text style={[styles.sigName, { color: theme.textHigh }]}>{identity.signatureName}</Text>
              <Text style={[styles.sigSub, { color: theme.textLow }]}>Authorized Signature</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.sigSub, { color: theme.textLow }]}>Thank you for your business.</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textLow }]}>
              {identity.name} · {identity.email || 'contact@business.com'}
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  shareBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  backBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  topBarTitle: { fontSize: 14, fontWeight: '600', fontFamily: 'monospace' },
  paper: {
    margin: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 40,
  },
  brandHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  brandLeft: { flex: 1 },
  brandRight: { alignItems: 'flex-end' },
  logo: { width: 56, height: 56, borderRadius: 10, marginBottom: 8 },
  companyName: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  taxId: { fontSize: 12, fontWeight: '500', marginBottom: 2 },
  addr: { fontSize: 12, fontWeight: '400', marginBottom: 2 },
  invoiceWordmark: { fontSize: 28, fontWeight: '900', letterSpacing: 4, color: '#E0E0E0', marginBottom: 6 },
  invoiceNum: { fontSize: 15, fontWeight: '700', fontFamily: 'monospace', marginBottom: 4 },
  invoiceMeta: { fontSize: 12, fontWeight: '500', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: Spacing.lg },
  billRow: { flexDirection: 'row', justifyContent: 'space-between' },
  billCard: { flex: 1 },
  billLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  billName: { fontSize: 17, fontWeight: '700', marginBottom: 3 },
  billSub: { fontSize: 13, fontWeight: '500' },
  tableHead: { flexDirection: 'row', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginBottom: 8 },
  th: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  tableRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: Spacing.md, borderBottomWidth: 1 },
  tdMain: { fontSize: 15, fontWeight: '600', marginBottom: 3 },
  tdSub: { fontSize: 12, fontWeight: '400' },
  td: { fontSize: 15, fontWeight: '600' },
  subtotalBlock: { paddingTop: Spacing.lg, gap: 10 },
  subtotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subtotalLabel: { fontSize: 14, fontWeight: '500' },
  subtotalValue: { fontSize: 14, fontWeight: '600' },
  totalRow: {
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    paddingTop: Spacing.md, marginTop: 4,
  },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { fontSize: 28, fontWeight: '900' },
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 50 },
  sigLine: { width: 160, height: 1, backgroundColor: '#000', marginBottom: 8 },
  sigName: { fontSize: 15, fontWeight: '600', fontStyle: 'italic', fontFamily: 'serif' },
  sigSub: { fontSize: 11, fontWeight: '500', marginTop: 3 },
  footer: { marginTop: Spacing.xl, alignItems: 'center' },
  footerText: { fontSize: 11, fontWeight: '500' },
  errorTitle: { fontSize: 22, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  errorSub: { fontSize: 15, fontWeight: '500', marginBottom: 24 },
  backPill: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  backPillText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
