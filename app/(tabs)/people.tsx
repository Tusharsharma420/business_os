import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';
import { useOSStore } from '@/store/useOSStore';

export default function PeopleScreen() {
  const theme = Colors.light;
  const team = useOSStore(state => state.team);

  // Simple analytics
  const totalPayroll = team.reduce((sum, emp) => sum + emp.salary, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { color: theme.textHigh }]}>People</Text>
        
        {/* Organizational Metrics */}
        <View style={[styles.metricsContainer, { backgroundColor: theme.surface }]}>
           <View style={styles.metricNode}>
              <Text style={[styles.metricValue, { color: theme.textHigh }]}>{team.length}</Text>
              <Text style={[styles.metricLabel, { color: theme.textLow }]}>Headcount</Text>
           </View>
           <View style={styles.metricNode}>
              <Text style={[styles.metricValue, { color: theme.primary }]}>${(totalPayroll / 1000).toFixed(1)}k</Text>
              <Text style={[styles.metricLabel, { color: theme.textLow }]}>Avg Payroll</Text>
           </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textHigh }]}>Organizational Roster</Text>

        <FlatList
          data={team}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View>
                <Text style={[styles.name, { color: theme.textHigh }]}>{item.name}</Text>
                <Text style={[styles.role, { color: theme.textLow }]}>{item.role}</Text>
              </View>
              <View style={styles.compContainer}>
                <Text style={[styles.salary, { color: theme.textHigh }]}>
                  ${(item.salary / 1000).toFixed(0)}k
                </Text>
                <View style={styles.badgeContainer}>
                  <Text style={[
                     styles.badge, 
                     { backgroundColor: item.status === 'Active' ? '#F0FDF4' : '#FEF2F2',
                       color: item.status === 'Active' ? theme.positive : theme.negative }
                  ]}>
                     {item.status}
                  </Text>
                </View>
              </View>
            </View>
          )}
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
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.xl,
    justifyContent: 'space-around',
  },
  metricNode: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    fontWeight: '500',
  },
  compContainer: {
    alignItems: 'flex-end',
  },
  salary: {
    fontSize: 16,
    fontWeight: '700',
  },
  badgeContainer: {
    marginTop: 6,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  }
});
