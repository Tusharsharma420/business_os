# Product Requirements Document: Unified Business OS (Apple-Clean Version)

## 0. Philosophy & First Principles
The system must be invisible. It eliminates friction by removing traditional "modules" (Accounting, CRM, Inventory) and replacing them with three simple, universal actions. Everything else is metadata. The design is Apple-clean: no overthinking, no complex charts, just plain-language insights and frictionless data entry.

## 1. Core Workflow (Daily Use)

### 1.1 🧾 Transactions (Money Engine)
*Replaces: Accounting, Invoicing, Expenses, Revenue Tracking, Discounts, Pricing*
- **What it does:** The single source of truth for all financial movements.
- **Actions:** 
  - Money In (Add Sale)
  - Money Out (Add Expense)
- **Engine Automations:** Auto P&L generation, auto invoice/receipt generation.
- **Philosophy:** There is no "Accounting Module". You do not think about double-entry, debits, or credits. You just "Record a transaction" and the system handles the rest.

### 1.2 👤 Contacts (People Engine)
*Replaces: Customers, Vendors, Manufacturers, Employees, Leads*
- **What it does:** A single, unified database for every human or entity the business interacts with.
- **Actions:** 
  - Add/Edit Contact
  - View relationship history and generated transactions.
- **Tags:** Customer, Vendor, Partner.
- **Philosophy:** One unified system. No duplication. A vendor today can be a customer tomorrow.

### 1.3 📦 Items (Product Engine)
*Replaces: Complex product catalogs, service listings, complex inventory management*
- **What it does:** The list of things being exchanged in transactions.
- **Actions:** 
  - Add/Edit products and services
  - Assign Price and Category
- **Philosophy:** Clean, editable, simple.

## 2. Intelligence Layer & Dashboard

### 2.1 📊 Dashboard (The Apple Version)
*Replaces: Traditional dashboards with charts, graphs, filters, and widgets.*
- **What it does:** The very first thing the user sees. It tells them exactly what they need to know without forcing them to interpret raw data grids.
- **Interface:** Simple, contextual, plain-language statements.
  - *"You earned ₹25,000 today"*
  - *"₹8,000 pending"*
  - *"Top product: X"*
  - *"3 customers unpaid"*
- **Philosophy:** No thinking required.

## 3. Supporting Layers (Hidden but Essential)

### 3.1 ⚙️ Business Identity (Metadata)
*Replaces: Complex configuration wizards and standalone setting features.*
- **What it does:** The invisible metadata attached to the business identity.
- **Elements:**
  - Logo
  - Signature
  - Address
  - Email
  - Mobile Number
- **Philosophy:** 1-time setup. It's not a feature of the daily workflow. Apple wouldn't build an app around adding your signature; it's simply meta-data applied automatically to outputs.

### 3.2 📄 Documents (Outputs)
*Replaces: Embedded document editors or complex sheet views.*
- **What it does:** Documents are strictly the auto-generated outputs of actions, never manual tasks to be "created from scratch".
- **External Outputs (PDFs):** 
  - Invoice PDF
  - Receipt 
  - Summary Report
- **Internal Views (Sheets):** Simple editable tables for internal auditing. No spreadsheet formulas, no complexity.

---

## 🎯 Final MVP Structure
**Core (What user uses daily)**
1. **Transactions:** Add sale, Add expense, Auto profit calculation
2. **Contacts:** Add customer/vendor, View history
3. **Items:** Add/edit product or service

**Supporting (Hidden but essential)**
- **Business Identity:** Logo, Signature, Contact info

**Intelligence Layer**
- **Dashboard:** Plain insights, Alerts, Suggestions
