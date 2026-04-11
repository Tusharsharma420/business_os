import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

export default function SettingsScreen() {
  const theme = Colors.light;
  const identity = useOSStore(state => state.identity);
  const updateIdentity = useOSStore(state => state.updateIdentity);

  const [name, setName] = useState(identity.name);
  const [taxId, setTaxId] = useState(identity.taxId);
  const [logoUrl, setLogoUrl] = useState(identity.logoUrl);
  const [signatureName, setSignatureName] = useState(identity.signatureName);

  const handleSave = () => {
    updateIdentity({ name, taxId, logoUrl, signatureName });
    alert('Business Identity Saved');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>Identity</Text>
        <Text style={[styles.subtitle, { color: theme.textLow }]}>Your Business Metadata</Text>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textHigh }]}>Business Name</Text>
          <TextInput 
            style={[styles.input, { borderColor: theme.surface, color: theme.textHigh }]} 
            value={name} 
            onChangeText={setName} 
            placeholderTextColor={theme.textLow}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textHigh }]}>Tax ID / EIN</Text>
          <TextInput 
            style={[styles.input, { borderColor: theme.surface, color: theme.textHigh }]} 
            value={taxId} 
            onChangeText={setTaxId} 
            placeholderTextColor={theme.textLow}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textHigh }]}>Logo Asset (URL)</Text>
          <TextInput 
            style={[styles.input, { borderColor: theme.surface, color: theme.textHigh }]} 
            value={logoUrl} 
            onChangeText={setLogoUrl} 
            placeholderTextColor={theme.textLow}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.textHigh }]}>Digital Signature</Text>
          <TextInput 
            style={[styles.input, { borderColor: theme.surface, color: theme.textHigh }]} 
            value={signatureName} 
            onChangeText={setSignatureName} 
            placeholderTextColor={theme.textLow}
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: theme.primary }]} 
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>Save Metadata</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.xl,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: 16,
    fontWeight: '500',
  },
  saveBtn: {
    padding: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
