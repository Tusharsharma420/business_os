import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

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
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateIdentity({ name, taxId, logoUrl, signatureName, address, email, phone, currency, taxRate: parseFloat(taxRate) || 18 });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({ label, value, onChange, placeholder, keyboard }: any) => (
    <View style={styles.formGroup}>
      <Text style={[styles.label, { color: theme.textLow }]}>{label}</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>Identity</Text>
        <Text style={[styles.subtitle, { color: theme.textLow }]}>Applied to all invoices & reports</Text>

        <Field label="Business Name" value={name} onChange={setName} placeholder="Acme Corp" />
        <Field label="Tax ID / GST / EIN" value={taxId} onChange={setTaxId} placeholder="27AAPFU0939F1ZV" />
        <Field label="Address" value={address} onChange={setAddress} placeholder="123 Main St, Mumbai" />
        <Field label="Email" value={email} onChange={setEmail} placeholder="hello@business.com" keyboard="email-address" />
        <Field label="Phone" value={phone} onChange={setPhone} placeholder="+91 98765 43210" keyboard="phone-pad" />
        <Field label="Logo URL" value={logoUrl} onChange={setLogoUrl} placeholder="https://..." />
        <Field label="Digital Signature Name" value={signatureName} onChange={setSignatureName} placeholder="Authorized Signatory" />
        <Field label="Invoice Tax Rate (%)" value={taxRate} onChange={setTaxRate} placeholder="18" keyboard="decimal-pad" />

        {/* Currency Selector */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textLow }]}>Currency Symbol</Text>
          <View style={styles.currencyRow}>
            {CURRENCIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.currencyBtn, currency === c && { backgroundColor: theme.primary }]}
                onPress={() => setCurrency(c)}
              >
                <Text style={[styles.currencyText, { color: currency === c ? '#FFF' : theme.textHigh }]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: saved ? '#34C759' : theme.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>{saved ? '✓ Saved!' : 'Save Identity'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.lg },
  headerTitle: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5, marginBottom: Spacing.xs, marginTop: Spacing.md },
  subtitle: { fontSize: 14, marginBottom: Spacing.xl, fontWeight: '500' },
  formGroup: { marginBottom: Spacing.lg },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.xs },
  input: { borderRadius: 12, paddingHorizontal: Spacing.md, paddingVertical: 14, fontSize: 16, fontWeight: '500' },
  currencyRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  currencyBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center' },
  currencyText: { fontSize: 18, fontWeight: '700' },
  saveBtn: { padding: Spacing.lg, borderRadius: 14, alignItems: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xxl },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
