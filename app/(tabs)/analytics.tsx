import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { AppleCard } from '@/components/AppleCard';
import { TrendingUp, TrendingDown, Wallet, ListChecks } from 'lucide-react-native';
import { ApiService } from '@/lib/apiService';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AnalyticsScreen');

interface Summary {
  totalIn: number;
  totalOut: number;
  balance: number;
  transactionCount: number;
}

export default function AnalyticsScreen() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // We need to add fetchAnalytics to ApiService
      const res = await fetch('http://10.59.0.114:3000/api/analytics/summary');
      const data = await res.json();
      setSummary(data);
    } catch (e) {
      logger.error('fetch_analytics_error', { error: (e as any).message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAnalytics} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Your business at a glance</Text>
      </View>

      <View style={styles.grid}>
        <MetricCard 
          title="Total Revenue" 
          value={`₹${summary?.totalIn || 0}`} 
          icon={<TrendingUp color="#10b981" size={24} />} 
          color="#10b981"
        />
        <MetricCard 
          title="Total Expenses" 
          value={`₹${summary?.totalOut || 0}`} 
          icon={<TrendingDown color="#ef4444" size={24} />} 
          color="#ef4444"
        />
        <MetricCard 
          title="Net Profit" 
          value={`₹${summary?.balance || 0}`} 
          icon={<Wallet color="#3b82f6" size={24} />} 
          color="#3b82f6"
        />
        <MetricCard 
          title="Transactions" 
          value={`${summary?.transactionCount || 0}`} 
          icon={<ListChecks color="#6b7280" size={24} />} 
          color="#6b7280"
        />
      </View>

      {/* Charts will go here in next sub-task */}
      <View style={styles.chartPlaceholder}>
        <Text style={styles.placeholderText}>Monthly Trend Chart coming soon...</Text>
      </View>
    </ScrollView>
  );
}

function MetricCard({ title, value, icon, color }: any) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  grid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartPlaceholder: {
    margin: 16,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#94a3b8',
  }
});
