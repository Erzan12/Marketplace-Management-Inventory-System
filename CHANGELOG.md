# 📋 Changelog — v1.5.0 (Stable Release)

## ✨ Added

* Full **frontend-backend integration**
* **Administrator module** with dashboard
* **User authentication system**

  * Login, registration, logout
  * User profile support
* **JWT authentication with refresh tokens**
* **Cookie-based session handling**
* **Swagger API documentation**
* **Products module**

  * Products listing page
  * Single product view via slug
  * Categories and featured products sections
* **Cart system**

  * Add, remove, update quantity
* **Pagination** for product listings
* New UI components:

  * Navbar, Footer, Hero, Newsletter
* **API client & query provider** for frontend
* **PostgreSQL database integration**

---

## 🔄 Changed

* Migrated authentication from **Bearer token → cookie-based JWT**
* Refactored **auth, user, product, and cart modules**
* Updated **product schema**

  * Added slug (unique)
  * Added comparedAtPrice
  * Improved relations (categories, images, inventory)
* Converted primary keys from **INT → UUID**
* Improved **cart logic and API structure**
* Refactored frontend hooks:

  * useProducts, useProduct, useCart
* Improved landing page with dynamic backend data
* Updated project structure to **Turborepo monorepo**
* Adjusted API endpoints and controllers for consistency
* Updated environment configuration for deployment

---

## 🐛 Fixed

* Fixed cart issues:

  * Quantity update causing 400 errors
  * Item removal causing 500 errors
  * Cart clearing causing 500 errors
* Fixed frontend-backend connection inconsistencies
* Resolved API response mismatches
* Fixed product data rendering issues
* Addressed authentication/session edge cases

---

## 🔐 Security

* Implemented **access + refresh token strategy**
* Added **token versioning and session validation**
* Improved authentication flow and protected routes

---

## 🚀 Deployment

* Deployed **backend services on Render**
* Deployed **frontend on Netlify**
* Migrated database to **PostgreSQL**
* Configured environment variables for production
* Adjusted ports and build configurations for hosting compatibility

---

## 🧱 Internal / Developer Experience

* Added reusable decorators and DTOs
* Improved API structure and service layers
* Refactored codebase for modularity and scalability
* Enhanced developer tooling and documentation (Swagger)

---

## ✅ Notes

* This version marks the **first stable, production-ready release**
* All core features (auth, products, cart, admin) are now functional and integrated

---

If you want, I can also generate a **super short semantic version changelog (GitHub style)** or a **commit-style changelog grouped per module**.
