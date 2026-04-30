# Architecture Plan: Custom Database & Backend for Business OS

## Overview
We are building a custom backend and database tailored specifically for the Business OS. This replaces Firebase and gives us 100% control over our data, enabling powerful SQL queries for business intelligence.

## Tech Stack
- **Database Engine:** SQLite (Local, fast, 0 config, highly portable).
- **ORM:** Drizzle ORM (Type-safe, fast, and minimal).
- **Backend Framework:** Node.js + Express.
- **Language:** TypeScript.

## Core Schema
1. **Contacts:** Unified list of people/vendors.
2. **Items:** Unified list of products/services.
3. **Transactions:** Core financial movements, linked to Contacts and Items.
