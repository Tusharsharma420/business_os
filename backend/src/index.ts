import express from "express";
import cors from "cors";
import { db } from "./db/db";
import { contacts, items, transactions } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();
app.use(cors());
app.use(express.json());

// Helper for generating IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Business OS Backend running on http://localhost:${PORT}`);
});
