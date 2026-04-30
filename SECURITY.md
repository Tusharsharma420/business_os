# 🔐 Security Blueprint: Business OS v5

## 1. Authentication Flow
- **Mechanism**: JWT (JSON Web Tokens) with short-lived Access Tokens and long-lived Refresh Tokens.
- **Refresh Token Storage**: HTTP-only Cookies (Web) / Secure Store (Mobile).
- **Password Hashing**: Bcrypt with a salt factor of 12.

## 2. Authorization (RBAC)
Roles:
- **OWNER**: Full access to all firms and settings.
- **ADMIN**: Access to transactions, catalog, and entities.
- **STAFF**: Access to log transactions and view catalog.

## 3. Data Integrity
- **Transactional Safety**: All ledger movements must occur within a SQL transaction.
- **Validation**: Strict Zod schemas for all API inputs and outputs.
- **Immutability**: Once a transaction is "Completed", it cannot be edited, only "Reversed" by a new transaction.

## 4. Network Security
- **Transport**: HTTPS/TLS for all communication.
- **CORS**: Restricted to trusted domains in production.
- **Rate Limiting**: Applied to all Auth and sensitive endpoints.
