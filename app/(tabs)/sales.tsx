/**
 * sales.tsx — DEPRECATED (V1 Pipeline/Deals screen)
 * Replaced by Transactions in the new PRD architecture.
 * This file is kept to prevent router crashes. It redirects to Transactions.
 */
import { Redirect } from 'expo-router';

export default function SalesScreen() {
  return <Redirect href="/(tabs)/transactions" />;
}
