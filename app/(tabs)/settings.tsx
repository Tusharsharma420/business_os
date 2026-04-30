import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { AppleDesign } from '@/constants/AppleDesign';
import { useOSStore } from '@/store/useOSStore';
import { AppleCard } from '@/components/AppleCard';
import { Icon } from '@/components/ui/icon';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Image as ImageIcon, 
  FileSignature, 
  Percent, 
  Target,
  CheckCircle2,
  Save,
  Fingerprint
} from 'lucide-react-native';

const CURRENCIES = ['₹', '$', '€', '£', '¥', 'AED'];

export default function SettingsScreen() {
  const theme = Colors.light;
  const identity = useOSStore(state => state.identity);
  const updateIdentity = useOSStore(state => state.updateIdentity);

  const [name, setName] = useState(identity.name);
  const [taxId, setTaxId] = useState(identity.taxId);
  const [logoUrl, setLogoUrl] = useState(identity.logoUrl);
  const [signatureName, setSignatureName] = useState(identity.signatureName);
  const [address, setAddress] = useState(identity.address);
  const [email, setEmail] = useState(identity.email);
  const [phone, setPhone] = useState(identity.phone);
  const [currency, setCurrency] = useState(identity.currency);
  const [taxRate, setTaxRate] = useState(String(identity.taxRate));
  const [monthlyRevenueGoal, setMonthlyRevenueGoal] = useState(String(identity.monthlyRevenueGoal));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateIdentity({ 
      name, taxId, logoUrl, signatureName, address, email, phone, currency, 
      taxRate: parseFloat(taxRate) || 18,
      monthlyRevenueGoal: parseFloat(monthlyRevenueGoal) || 0 
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({ label, value, onChange, placeholder, keyboard, icon: FieldIcon }: any) => (
    <View style={styles.formGroup}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
        {FieldIcon && <Icon icon={FieldIcon} size={12} color={theme.textLow} style={{ marginRight: 6 }} />}
        <Text style={[styles.label, { color: theme.textLow }]}>{label}</Text>
      </View>
      <TextInput
        style={[styles.input, { color: theme.textHigh, backgroundColor: '#F2F2F7' }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.textLow}
        keyboardType={keyboard ?? 'default'}
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: AppleDesign.colors.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
           <Text style={styles.dateText}>MANAGEMENT</Text>
           <Text style={styles.title}>Identity</Text>
        </View>

        <AppleCard style={styles.heroCard}>
           <View style={styles.heroRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                 <Building2 size={24} color={AppleDesign.colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                 <Text style={styles.businessName}>{name || 'Business Name'}</Text>
                 <Text style={styles.businessSub}>{taxId || 'No Tax ID'}</Text>
              </View>
           </View>
        </AppleCard>

        <Text style={styles.sectionTitle}>Business Details</Text>
        <AppleCard style={styles.formCard}>
          <Field label="Business Name" value={name} onChange={setName} placeholder="Acme Corp" icon={Building2} />
          <Field label="Tax ID / GST / EIN" value={taxId} onChange={setTaxId} placeholder="27AAPFU0939F1ZV" icon={Fingerprint} />
          <Field label="Address" value={address} onChange={setAddress} placeholder="123 Main St, Mumbai" icon={MapPin} />
        </AppleCard>

        <Text style={styles.sectionTitle}>Contact & Signature</Text>
        <AppleCard style={styles.formCard}>
          <Field label="Email" value={email} onChange={setEmail} placeholder="hello@business.com" keyboard="email-address" icon={Mail} />
          <Field label="Phone" value={phone} onChange={setPhone} placeholder="+91 98765 43210" keyboard="phone-pad" icon={Phone} />
          <Field label="Digital Signature" value={signatureName} onChange={setSignatureName} placeholder="Authorized Signatory" icon={FileSignature} />
        </AppleCard>

        <Text style={styles.sectionTitle}>Billing Config</Text>
        <AppleCard style={styles.formCard}>
          <Field label="Default Tax Rate (%)" value={taxRate} onChange={setTaxRate} placeholder="18" keyboard="decimal-pad" icon={Percent} />
          <Field label="Revenue Goal" value={monthlyRevenueGoal} onChange={setMonthlyRevenueGoal} placeholder="50000" keyboard="decimal-pad" icon={Target} />
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Currency Symbol</Text>
            <View style={styles.currencyRow}>
              {CURRENCIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.currencyBtn, currency === c && { backgroundColor: AppleDesign.colors.primary }]}
                  onPress={() => setCurrency(c)}
                >
                  <Text style={[styles.currencyText, { color: currency === c ? '#FFF' : AppleDesign.colors.text.high }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </AppleCard>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: saved ? '#34C759' : AppleDesign.colors.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon icon={saved ? CheckCircle2 : Save} size={20} color="#FFF" />
            <Text style={styles.saveBtnText}>{saved ? 'Saved!' : 'Save Changes'}</Text>
          </View>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  header: { marginTop: 40, marginBottom: 24 },
  dateText: { fontSize: 12, fontWeight: '700', color: AppleDesign.colors.text.low, letterSpacing: 1, marginBottom: 4 },
  title: { ...AppleDesign.typography.h1, color: AppleDesign.colors.text.high },
  heroCard: { padding: 16, marginBottom: 24 },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  businessName: { fontSize: 20, fontWeight: '800', color: AppleDesign.colors.text.high },
  businessSub: { fontSize: 14, color: AppleDesign.colors.text.low, marginTop: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: AppleDesign.colors.text.low, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginLeft: 4 },
  formCard: { padding: 16, marginBottom: 24 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '500' },
  currencyRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  currencyBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center' },
  currencyText: { fontSize: 16, fontWeight: '700' },
  saveBtn: { padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 60, ...AppleDesign.shadows.floating },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});

