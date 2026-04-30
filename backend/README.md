# Business OS Backend

High-performance, relational backend for Business OS built with Node.js, Express, and SQLite.

## Tech Stack
- **Runtime**: Node.js
- **Server**: Express
- **Database**: SQLite (local-first)
- **ORM**: Drizzle ORM
- **Language**: TypeScript

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Push the schema to the local SQLite database:
```bash
npm run db:push
```

### 3. Run Server
```bash
npm run dev
```

The server will run on `http://localhost:3000`.

## Engines
1. **People Engine**: Unified contact management.
2. **Product Engine**: Product and service inventory.
3. **Money Engine**: Transaction ledger with inventory cross-sync.
