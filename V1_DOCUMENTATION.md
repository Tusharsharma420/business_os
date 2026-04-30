# Business OS - Version 1 Documentation

## Overview
Business OS (V1) is an "Apple-Clean", frictionless, and unified business management platform built to simplify traditional Accounting, CRM, and Inventory modules into simple daily actions.

The goal of V1 was to eliminate friction and complex configurations by narrowing everything down to three universal actions: Transactions, Contacts, and Items.

## Tech Stack (V1)
- **Framework:** Expo / React Native
- **Routing:** Expo Router (`app/` directory file-based routing)
- **State Management:** Zustand
- **Database/Backend:** Firebase (`firebase` package)
- **Icons:** Lucide React Native (`lucide-react-native`) & Expo Vector Icons
- **PDF/Printing:** Expo Print (`expo-print`)

## Core Modules & Features (V1)

### 1. 🧾 Transactions (Money Engine)
- **File:** `app/(tabs)/transactions.tsx`
- **Purpose:** Single source of truth for all financial movements (Money In / Money Out).
- **Features:** 
  - Add Sale / Add Expense
  - Replaces traditional double-entry accounting with simple income/expense tracking.

### 2. 👤 Contacts (People Engine)
- **File:** `app/(tabs)/contacts.tsx`, `app/contact/`
- **Purpose:** A unified database for every human or entity (Customers, Vendors, Partners).
- **Features:** 
  - Add/Edit Contact
  - View relationship history and transactions.

### 3. 📦 Items (Product Engine)
- **File:** `app/(tabs)/items.tsx`
- **Purpose:** Catalog for products and services.
- **Features:** 
  - Add/Edit products and services
  - Price and Category management.

### 4. 📊 Intelligence & Reporting
- **Files:** `app/(tabs)/index.tsx` (Dashboard), `app/(tabs)/reports.tsx`
- **Purpose:** Simple, contextual plain-language statements about the business.
- **Features:** 
  - Top-level insights (e.g., "You earned ₹X today").
  - Auto-generated reports without complex configuration.

### 5. ⚙️ Settings & Business Identity
- **File:** `app/(tabs)/settings.tsx`
- **Purpose:** Metadata for the business identity (Logo, Signature, Address, Email).
- **Features:** 
  - Invisible metadata attached to outputs.

### 6. 📄 Documents & Invoicing
- **File:** `app/invoice/`
- **Purpose:** Auto-generated outputs (PDF Invoices, Receipts).
- **Features:**
  - PDF generation using Expo Print.

## Architectural Notes (V1)
- **UI/UX:** Extremely clean, avoiding traditional dashboards and charts in favor of a plain-language interface.
- **Data Model:** Centralized with Firebase, utilizing Zustand for local state and rapid updates.

## Next Steps for V2 (Redesign & Re-architecture)
This repository is slated for restructuring, redesign, and re-architecting to establish a proper, scalable GitHub project standard for Version 2.
