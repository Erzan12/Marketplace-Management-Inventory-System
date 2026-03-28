# 🛒 ShopStack — Marketplace Management and Inventory System

ShopStack is a full-stack **multi-tenant marketplace platform** built with modern web technologies.
It evolved from a Shopify-based frontend into a fully custom system with complete control over data, business logic, and scalability. For more information read project docs here: https://erzan-docs.vercel.app/docs/Projects/Inventory-System/development-plan

---

## 🚀 Overview

This project transforms a traditional product inventory system into a **multi-vendor e-commerce platform** that supports:

* Multiple sellers (stores)
* Centralized administration
* Product and inventory management
* Scalable architecture for future growth

ShopStack is designed to function as a foundation for real-world marketplace applications.

---

## 🎯 Goals

* Own the data layer
* Control business logic
* Enable multi-store (multi-tenant) support
* Build a scalable, DevOps-ready system

---

## 🏗️ Architecture

ShopStack follows a **full-stack architecture**:

* **Frontend:** Next.js (apps/web)
* **Backend:** NestJS (apps/api)
* **Monorepo:** Turborepo
* **Language:** TypeScript
* **Database:** (PostgreSQl)

---

## 👥 User Roles

### 🛍️ Sellers

* Manage their own store
* Add and update products
* Track inventory

### 🏪 Store

* Customer-facing storefront

### 🛠️ Admin

* Manage users and sellers
* Monitor platform activity
* Control system-wide settings

---

## 📦 Features

* Multi-vendor marketplace support
* Product and inventory management
* Role-based access control
* Storefront and admin dashboards
* API-driven architecture

---

## 🔧 Tech Stack

* **Frontend:** Next.js
* **Backend:** NestJS
* **Monorepo Tooling:** Turborepo
* **Language:** TypeScript

---

## ⚙️ Getting Started

### 📋 Prerequisites

Make sure you have the following installed:

* Node.js (v18 or higher recommended)
* npm / yarn / pnpm (pnpm recommended for monorepos)
* Git

---

### 📥 Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/marketplace-management-inventory-system.git
cd marketplace-management-inventory-system
```

---

### 📦 Install Dependencies

If using **pnpm** (recommended):

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

---

### 🧪 Environment Setup

Create `.env` files for each app as needed:

```
apps/api/.env
apps/web/.env
```

Example variables (adjust to your setup):

```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### ▶️ Run the Development Servers

Start all apps using Turborepo:

```bash
pnpm dev
```

This will typically run:

* Frontend (Next.js) → http://localhost:3000
* Backend (NestJS) → http://localhost:3001

---

### 🏗️ Project Structure

```
apps/
  web/        # Next.js frontend
  api/        # NestJS backend

packages/
  ui/         # shared UI components (optional)
  config/     # shared configs (eslint, tsconfig, etc.)
```

---

## 📈 Future Improvements

* Migration to drizzle orm from prisma with supabase
* Payment gateway integration
* Order management system
* Analytics dashboard
* Notifications system
* CI/CD pipeline and containerization

---

## 🧠 Project Vision

ShopStack aims to be more than just an inventory system — it is a **scalable marketplace engine** that can power multiple online stores within a single platform.

---

## 📌 Status

🚧 Currently under active development

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome!
Feel free to fork the repository and submit a pull request.

---

## 📄 License
This project is open-source and available under the MIT License.

---

👤 Author
Erzan

- GitHub: https://github.com/Erzan12
- Portfolio: https://erzan-dev.vercel.app/

---

