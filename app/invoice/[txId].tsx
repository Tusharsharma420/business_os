import React from 'react';
import { 
  StyleSheet, View, Text, SafeAreaView, 
  ScrollView, TouchableOpacity, Share 
} from 'react-native';
import { AppleDesign } from '@/constants/AppleDesign';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOSStore } from '@/store/useOSStore';
import { AppleCard } from '@/components/AppleCard';
import { 
  ArrowLeft, 
  Share as ShareIcon, 
  Download, 
  CheckCircle2,
  ReceiptText
} from 'lucide-react-native';

export default function InvoiceScreen() {
  const { txId } = useLocalSearchParams();
  const router = useRouter();
  const { transactions, contacts, identity } = useOSStore();
  
  const tx = transactions.find(t => t.id === txId);
  const contact = contacts.find(c => c.id === tx?.contactId);
  const cur = identity.currency;

  if (!tx) return <View style={styles.error}><Text>Invoice Not Found</Text></View>;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Invoice from ${identity.name}\nTotal: ${cur}${tx.amount}\nContact: ${contact?.name}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={AppleDesign.colors.text.high} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Details</Text>
        <TouchableOpacity onPress={handleShare} style={styles.backBtn}>
          <ShareIcon size={22} color={AppleDesign.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusBadge}>
          <CheckCircle2 size={16} color="#2E7D32" />
          <Text style={styles.statusText}>{tx.status.toUpperCase()}</Text>
        </View>

        <Text style={styles.amount}>{cur}{tx.amount.toLocaleString()}</Text>
        <Text style={styles.date}>{new Date(tx.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>

        <AppleCard style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>BILL TO</Text>
          <Text style={styles.contactName}>{contact?.name ?? 'N/A'}</Text>
          <Text style={styles.contactInfo}>{contact?.phone ?? 'No phone'}</Text>
          <Text style={styles.contactInfo}>{contact?.email ?? 'No email'}</Text>
        </AppleCard>

        <AppleCard style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>ITEMS</Text>
          {tx.lineItems.length > 0 ? tx.lineItems.map((li, idx) => (
            <View key={idx} style={styles.itemRow}>
               <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{li.name}</Text>
                  <Text style={styles.itemSub}>{li.qty} x {cur}{li.price}</Text>
               </View>
               <Text style={styles.itemTotal}>{cur}{(li.qty * li.price).toLocaleString()}</Text>
            </View>
          )) : (
            <Text style={styles.itemName}>General Transaction</Text>
          )}

          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{cur}{(tx.amount + tx.discount - tx.tax).toLocaleString()}</Text>
          </View>
          {tx.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: '#C62828' }]}>-{cur}{tx.discount.toLocaleString()}</Text>
            </View>
          )}
          {tx.tax > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>+{cur}{tx.tax.toLocaleString()}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={[styles.summaryLabel, { fontWeight: '800', color: '#1C1C1E' }]}>Grand Total</Text>
            <Text style={[styles.summaryValue, { fontWeight: '800', fontSize: 18, color: '#1C1C1E' }]}>{cur}{tx.amount.toLocaleString()}</Text>
          </View>
        </AppleCard>

        {tx.note && (
          <AppleCard style={styles.sectionCard}>
             <Text style={styles.sectionLabel}>NOTE</Text>
             <Text style={styles.noteText}>{tx.note}</Text>
          </AppleCard>
        )}

        <TouchableOpacity style={styles.downloadBtn}>
           <Download size={20} color="#fff" />
           <Text style={styles.downloadText}>Download PDF</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppleDesign.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppleDesign.colors.text.high,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 42,
    fontWeight: '800',
    color: AppleDesign.colors.text.high,
    letterSpacing: -1,
  },
  date: {
    fontSize: 14,
    color: AppleDesign.colors.text.low,
    marginTop: 8,
    marginBottom: 32,
  },
  sectionCard: {
    width: '100%',
    padding: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: AppleDesign.colors.text.low,
    letterSpacing: 1,
    marginBottom: 12,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '700',
    color: AppleDesign.colors.text.high,
  },
  contactInfo: {
    fontSize: 14,
    color: AppleDesign.colors.text.low,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: AppleDesign.colors.text.high,
  },
  itemSub: {
    fontSize: 13,
    color: AppleDesign.colors.text.low,
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: AppleDesign.colors.text.high,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: AppleDesign.colors.text.low,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: AppleDesign.colors.text.high,
  },
  noteText: {
    fontSize: 14,
    color: AppleDesign.colors.text.medium,
    lineHeight: 20,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1C1C1E',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 20,
    ...AppleDesign.shadows.floating,
  },
  downloadText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
