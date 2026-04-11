# Product Requirements Document: Unified Business OS

## 0. Purpose & First Principles
Every business operates as a system converting inputs (leads, time, inventory, capital) into outputs (revenue, products, services). This OS removes inter-application friction by unifying the core business pillars into a single database and interface. The platform must be universally accessible, deeply integrated across web and native mobile applications, and designed for scalability.

## 1. System Modules (Atomic Units)

### 1.1 Customers (CRM)
- **Objective:** Track and optimize the customer lifecycle.
- **Inputs:** Lead data, communication logs, behavior metrics.
- **Outputs:** Unified customer profile, LTV (Lifetime Value) calculation.

### 1.2 Sales (Pipeline)
- **Objective:** Convert leads to recognizable financial events.
- **Inputs:** Deal stage, value, linked product/service.
- **Outputs:** Sales forecasts, finalized orders.

### 1.3 Operations & Inventory Management
- **Objective:** Manage assets or services being sold with deep customizability.
- **Inputs:** Physical inventory (SKUs, stock levels, COGS) and Non-physical entities (Services, consulting hours, digital products, subscription tiers).
- **Core Features:**
  - **Product/Service Architecture:** Seamlessly handle both stocked physical items and abstract services independently.
  - **Custom Configuration:** Adaptable fields for product variants, batch/lot tracking, or customizable service-specific parameters.
- **Outputs:** Dynamic stock depletion tracing, real-time inventory levels, gross margin analysis.

### 1.4 Finance (Accounting & Money)
- **Objective:** Real-time ledger of systemic entropy with robust double-entry mechanics.
- **Inputs:** Sales inflows, expense outflows, direct general ledger entries.
- **Core Features:**
  - **Debit / Credit Ledger:** Strict double-entry accounting adherence. Manual, automated, and adjusted debit/credit entry support.
  - **Multi-Firm Architecture:** Option to add and seamlessly act as multiple firms/business entities under a single unified dashboard, sharing global resources where necessary while maintaining rigidly separate financial and reporting boundaries.
  - **Custom Invoices (Printable):** Dynamic invoice generation engine with custom layouts and templates. Must strictly support export to printable formats (PDF), itemized grouping (Products vs. Services), custom branding/logos per firm, and dynamic compliance/taxation details.
- **Outputs:** Real-time P&L, Balance Sheet, Ledger activity, professional-grade printable invoices.

### 1.5 People (HR & Marketing)
- **Objective:** Manage human capital and outbound efforts.
- **Inputs:** Employee details, marketing spend, payroll components.
- **Outputs:** Payroll execution, Customer Acquisition Cost (CAC), Employee efficiency indexing.

### 1.6 Global Activity & Notifications
- **Objective:** The centralized nervous system for all state changes.
- **Inputs:** State mutation events from any module (e.g., deal shifts, inventory drops, invoice generated).
- **Outputs:** Real-time push notifications, chronologically sorted global activity feed.

### 1.7 Setup & Onboarding ("Easy Step-Up")
- **Objective:** Minimal friction initialization.
- **Core Feature:** Swift onboarding flow and setup wizard. Allows users to quickly instantiate single or multiple firms, pre-load standard chart of accounts, and define initial inventory/service catalogs with minimal clicks.

## 2. Event-Driven Data Flow
The system operates on an event-driven architecture to maintain state equilibrium:
1. **Event: Deal/Sale Closed**
   - → Triggers Invoice Generation with custom printable firm-specific template (Finance)
   - → Automatically debits Accounts Receivable and credits Revenue (Finance)
   - → Triggers physical inventory decrement—if a physical product is sold (Operations)
   - → Fires notification to Global Activity Feed

## 3. Scale & Platform Considerations
- **Cross-Platform Compatibility:** Seamless function across Web, iOS, and Android using Expo.
- **Time/Space Complexity:** Data retrieval must be `O(1)` for singular entities, leveraging NoSQL/Firebase scalability while ensuring structured relational integrity for double-entry accounting.
- **Observability:** Every state mutation must generate a structured log `[timestamp, level, module, event, input, output]`.
