<h1 align="center">
  <br>
  🏢 Business OS v2.0
  <br>
</h1>

<h4 align="center">High-performance, local-first business management platform with a custom relational backend.</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/backend-node.js-brightgreen.svg" alt="Backend">
  <img src="https://img.shields.io/badge/db-sqlite-blue.svg" alt="Database">
</p>

---

## 🚀 Features

- **Relational Data Integrity**: Custom SQL backend ensures complex business relationships are maintained.
- **Unified Engines**: Dedicated "People", "Product", and "Money" engines for modular scaling.
- **Real-time Local Sync**: Fast, low-latency communication with a local Node.js server.
- **Accounting Dashboard**: Advanced debit/credit tracking and cash flow analysis.
- **Inventory Engine**: Automated stock updates linked to transaction logic.

## 🛠 Tech Stack

- **Frontend**: React Native, Expo, Zustand
- **Backend**: Node.js, Express
- **Database**: SQLite, Drizzle ORM
- **State Management**: Zustand (Slices Architecture)

## 🏗 Architecture

The project is divided into two main modules:
- `/`: The Expo frontend application.
- `/backend`: The custom Node.js/SQLite API server.

## 🏁 Getting Started

### 1. Setup Backend
```bash
cd backend
npm install
npm run db:push
npm run dev
```

### 2. Setup Frontend
```bash
# In the root directory
npm install
npm start
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is [MIT](https://opensource.org/licenses/MIT) licensed.
