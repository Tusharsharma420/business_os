import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./db/db";
import { contacts, items, transactions, business_identity } from "./db/schema";
import { eq } from "drizzle-orm";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Helper for generating IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

app.get("/", (req, res) => {
  res.json({ message: "🚀 Business OS Backend is live!", status: "healthy" });
});

app.get("/api/identity", async (req, res) => {
  const identity = await db.select().from(business_identity);
  res.json(identity[0] || {});
});

app.post("/api/identity", async (req, res) => {
  const { name, taxId, currency, address, email, phone } = req.body;
  const existing = await db.select().from(business_identity);
  if (existing.length > 0) {
    const updated = await db.update(business_identity).set(req.body).where(eq(business_identity.id, existing[0].id)).returning();
    res.json(updated[0]);
  } else {
    const created = await db.insert(business_identity).values({
      id: "singleton",
      name, taxId, currency, address, email, phone
    }).returning();
    res.json(created[0]);
  }
});

// ==========================================
// 1. PEOPLE ENGINE (Contacts)
// ==========================================

app.get("/api/contacts", async (req, res) => {
  const allContacts = await db.select().from(contacts);
  res.json(allContacts);
});

app.post("/api/contacts", async (req, res) => {
  try {
    const { name, type, phone, email } = req.body;
    const newContact = await db.insert(contacts).values({
      id: generateId(),
      name,
      type,
      phone,
      email
    }).returning();
    res.status(201).json(newContact[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 2. PRODUCT ENGINE (Items)
// ==========================================

app.get("/api/items", async (req, res) => {
  const allItems = await db.select().from(items);
  res.json(allItems);
});

app.post("/api/items", async (req, res) => {
  try {
    const { name, type, price } = req.body;
    const newItem = await db.insert(items).values({
      id: generateId(),
      name,
      type,
      price
    }).returning();
    res.status(201).json(newItem[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 3. MONEY ENGINE (Transactions)
// ==========================================

app.get("/api/transactions", async (req, res) => {
  // Can join to get contact and item details later
  const allTransactions = await db.select().from(transactions);
  res.json(allTransactions);
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { type, amount, contactId, itemId, notes } = req.body;
    const newTx = await db.insert(transactions).values({
      id: generateId(),
      type,
      amount,
      contactId,
      itemId,
      notes
    }).returning();
    res.status(201).json(newTx[0]);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 4. UPDATES & DELETIONS
// ==========================================

app.delete("/api/contacts/:id", async (req, res) => {
  await db.delete(contacts).where(eq(contacts.id, req.params.id));
  res.json({ success: true });
});

app.delete("/api/items/:id", async (req, res) => {
  await db.delete(items).where(eq(items.id, req.params.id));
  res.json({ success: true });
});

app.delete("/api/transactions/:id", async (req, res) => {
  await db.delete(transactions).where(eq(transactions.id, req.params.id));
  res.json({ success: true });
});

app.put("/api/contacts/:id", async (req, res) => {
  const updated = await db.update(contacts).set(req.body).where(eq(contacts.id, req.params.id)).returning();
  res.json(updated[0]);
});

app.put("/api/items/:id", async (req, res) => {
  const updated = await db.update(items).set(req.body).where(eq(items.id, req.params.id)).returning();
  res.json(updated[0]);
});

// ==========================================
// 5. ANALYTICS ENGINE
// ==========================================

app.get("/api/analytics/summary", async (req, res) => {
  try {
    const txs = await db.select().from(transactions);
    const summary = txs.reduce((acc, tx) => {
      if (tx.type === "IN") acc.totalIn += tx.amount;
      if (tx.type === "OUT") acc.totalOut += tx.amount;
      return acc;
    }, { totalIn: 0, totalOut: 0 });

    res.json({
      ...summary,
      balance: summary.totalIn - summary.totalOut,
      transactionCount: txs.length
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_IP = process.env.PUBLIC_IP || 'localhost';

app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 Business OS Backend running on http://${PUBLIC_IP}:${PORT}`);
});
