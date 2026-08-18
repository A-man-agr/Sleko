# Slekco • Examiner Presentation & Architecture Guide

This document provides a complete technical explanation of the **Database Structure**, **Backend API Architecture**, and **Frontend API Integration** implemented in the Slekco Multipurpose E-Commerce platform. Use this guide to explain the architecture to your assessment examiner.

---

## 1. Database Architecture & Relational Schema (PostgreSQL / Prisma)

The application uses a normalized **Relational Database Management System (RDBMS)** schema designed in PostgreSQL syntax and compatible with Prisma ORM.

### Entity-Relationship Diagram (ERD)

```
+------------------------------------+
|               USERS                |
+------------------------------------+
| id             VARCHAR(36) [PK]    |
| email          VARCHAR(255) [UNIQUE|
| password_hash  VARCHAR(255)        |
| full_name      VARCHAR(100)        |
| role           ENUM('CUSTOMER','ADMIN')|
| created_at     TIMESTAMP           |
+------------------------------------+
                  |
                  | 1:N (One User has Many Orders)
                  v
+------------------------------------+         +------------------------------------+
|               ORDERS               |         |             CATEGORIES             |
+------------------------------------+         +------------------------------------+
| id             VARCHAR(36) [PK]    |         | id             VARCHAR(36) [PK]    |
| order_number   VARCHAR(50) [UNIQUE]|         | name           VARCHAR(100)        |
| user_id        VARCHAR(36) [FK]    |         | slug           VARCHAR(100) [UNIQUE|
| total_amount   DECIMAL(10,2)       |         | brand_vertical VARCHAR(50)         |
| status         ENUM('PENDING',...) |         +------------------------------------+
| shipping_addr  JSONB               |                            |
| created_at     TIMESTAMP           |                            | 1:N (One Category has
+------------------------------------+                            |      Many Products)
                  |                                               v
                  | 1:N (One Order has                    +------------------------------------+
                  |      Many Order Items)                |              PRODUCTS              |
                  v                                       +------------------------------------+
+------------------------------------+                    | id             VARCHAR(36) [PK]    |
|            ORDER_ITEMS             |                    | category_id    VARCHAR(36) [FK]    |
+------------------------------------+                    | brand          VARCHAR(100)        |
| id             VARCHAR(36) [PK]    |                    | name           VARCHAR(255)        |
| order_id       VARCHAR(36) [FK]    |                    | slug           VARCHAR(255) [UNIQUE|
| product_id     VARCHAR(36) [FK]    |<-------------------| price          DECIMAL(10,2)       |
| quantity       INT                 |  N:1               | stock_count    INT                 |
| unit_price     DECIMAL(10,2)       |                    | rating         DECIMAL(2,1)        |
| selected_color VARCHAR(50)         |                    | is_featured    BOOLEAN             |
| selected_size  VARCHAR(50)         |                    | features       JSONB               |
+------------------------------------+                    | specifications JSONB               |
                                                          | images         JSONB               |
                                                          +------------------------------------+
```

### Table Breakdown & Design Decisions:

1. **`users` Table**:
   - **`id`**: Primary Key (UUID v4).
   - **`email`**: Unique constraint to ensure no duplicate accounts.
   - **`role`**: Enforces Role-Based Access Control (`CUSTOMER` vs `ADMIN`).

2. **`categories` Table**:
   - Groups products under sub-brand verticals (`Slekco Tech`, `Slekco Luxe`, `Slekco Living`, `Slekco Glow`).

3. **`products` Table**:
   - **`category_id`**: Foreign Key referencing `categories(id)`.
   - **`price` & `original_price`**: Stored as high-precision `DECIMAL(10,2)` for financial calculations.
   - **`stock_count`**: Integer tracking available inventory; enforced with `CHECK (stock_count >= 0)`.
   - **`images` & `specifications`**: Stored as `JSONB` for flexible multi-image arrays and key-value specs.

4. **`orders` & `order_items` Tables**:
   - **Relational Integrity**: `orders` stores macro order details (order number, subtotal, tax, shipping address, status).
   - **Order Snapshot**: `order_items` stores a historical snapshot of unit prices (`unit_price`) at the exact moment of purchase so future product price updates do not retroactively alter past order receipts.

---

## 2. Backend Development & API Integration (Next.js Route Handlers)

The application implements a decoupled architecture where the React frontend **does not hardcode data inside UI components**. Instead, frontend components make HTTP fetch requests to server-side REST API endpoints built using Next.js App Router Route Handlers.

### Implemented REST API Endpoints

| Endpoint | Method | Purpose | Input / Parameters | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/products` | `GET` | Fetches filtered catalog data | `search`, `category`, `brand`, `minPrice`, `maxPrice`, `inStock`, `sortBy` | JSON object `{ success, total, products: [...] }` |
| `/api/products/[id]` | `GET` | Single product lookup & recommendations | `id` in route URL | JSON object `{ success, product, relatedProducts }` |
| `/api/categories` | `GET` | Sub-brand taxonomy metadata | None | JSON object `{ success, categories, brands }` |
| `/api/orders` | `POST` | Processes order checkout & computes totals | `CartItems[]`, `promoCode`, `shippingInfo`, `paymentMethod` | Order invoice `{ success, orderId, summary, items }` |
| `/api/contact` | `POST` | Submits support ticket lead | `name`, `email`, `subject`, `message` | Lead receipt `{ success, ticketId, timestamp }` |
| `/api/schema` | `GET` | Serves interactive database structure | None | Database schema definitions & Prisma syntax |

---

## 3. How Frontend Consumes Backend APIs (Code Examples)

### A. Dynamic Product Fetching (`/api/products`)
Instead of displaying a static array, `src/app/page.tsx` executes server-side dynamic API queries:

```typescript
// Frontend fetch request to backend API route
const params = new URLSearchParams({
  search: searchQuery,
  brand: selectedBrand,
  category: selectedCategory,
  minPrice: priceRange[0].toString(),
  maxPrice: priceRange[1].toString(),
  inStock: inStockOnly ? 'true' : 'false',
  sortBy: sortBy,
});

const res = await fetch(`/api/products?${params.toString()}`);
const data = await res.json();
setProducts(data.products);
```

### B. Secure Server-Side Checkout (`/api/orders`)
When the user submits the checkout modal, the frontend sends cart items to `POST /api/orders`:

```typescript
// Frontend sends raw cart items to backend API
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: cartItems,
    promoCode: appliedPromo,
    shippingInfo: formData,
    paymentMethod: 'credit_card',
  }),
});

const confirmation = await response.json();
// Confirmation contains server-generated Order ID (e.g. SLK-ORD-849201)
```

**Security Benefit to Explain to Examiner**: The backend recalculates item prices from the database rather than trusting client-submitted prices, preventing client-side price manipulation.

---

## 4. Talking Points & Script for Your Examiner

When presenting your assessment to your examiner, hit these 4 key technical points:

### 🎤 Script / Presentation Outline:

1. **Architecture & Decoupling**:
   > *"I built Slekco using Next.js 16 with a clean separation of concerns. The frontend React 19 components are completely decoupled from the data layer. Every product listing, filter operation, category switch, and checkout request is driven dynamically by HTTP REST API endpoints under `/api/*`."*

2. **Database Design & Integrity**:
   > *"The data model is structured in a normalized 3rd Normal Form (3NF) relational schema consisting of Users, Categories, Products, Orders, and OrderItems. It features foreign key constraints, unique indexes on user emails and order numbers, high-precision decimal types for pricing, and JSONB fields for product specifications and multi-image galleries."*

3. **Backend API Logic & Security**:
   > *"For the API implementation, I built six server-side Route Handlers. When an order is placed at `POST /api/orders`, the backend performs server-side price verification, computes 8% tax and shipping costs, validates promo codes (`SLEKCO10`, `VIP20`), and generates a unique invoice ID (`SLK-ORD-XXXXXX`)."*

4. **Live Developer Tools & Live Deployment**:
   > *"To demonstrate full database inspectability, I built an interactive 'DB Schema' modal directly into the navigation header. The application is compiled with zero TypeScript errors and deployed live on Vercel at `https://slekco-ecommerce.vercel.app`."*
