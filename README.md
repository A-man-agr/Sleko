# Slekco • Multipurpose E-Commerce Experience

> **Web Developer Assessment Submission**  
> **Brand**: Slekco (Multipurpose E-Commerce: Tech, Luxe, Living, Glow)  
> **Live Production URL**: [https://slekco-ecommerce.vercel.app](https://slekco-ecommerce.vercel.app)  
> **Deployment Status**: 🟢 LIVE & READY (Vercel Production)

---

## 📌 Executive Summary & Assessment Overview

**Slekco** is a modern, high-performance, multipurpose e-commerce web application engineered with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS 4**.

The application orchestrates four distinct sub-brands under one unified luxury ecosystem:
1. **Slekco Tech**: High-fidelity ANC headphones, smartwatches, mechanical keyboards, and audio monitors.
2. **Slekco Luxe**: Heavyweight organic apparel, wool trench coats, Italian leather duffels, and titanium sunglasses.
3. **Slekco Living**: Architectural ceramic lighting, pour-over coffee stations, French flax linen, and botanical candles.
4. **Slekco Glow**: Multi-weight Hyaluronic serums, renewing facial oils, lip treatments, and ultrasonic thermal cleansing tools.

---

## 🛠️ Technology Stack Used

| Tier | Technologies |
| :--- | :--- |
| **Frontend Framework** | **Next.js 16.3 (App Router)** & **React 19** |
| **Language** | **TypeScript 5** (Strict Type Safety across Models & APIs) |
| **Styling & UI** | **Tailwind CSS 4**, Glassmorphic design system, CSS micro-animations |
| **State Management** | **React Context API** (`CartContext`, `WishlistContext`) + `localStorage` persistence |
| **Backend & API** | **Next.js Route Handlers (REST API)** (`/api/products`, `/api/orders`, `/api/categories`, `/api/contact`, `/api/schema`) |
| **Database Architecture** | **PostgreSQL / Prisma ORM Schema** definitions + interactive in-app schema explorer |
| **Validation** | Client & Server-side form validation (Checkout, Contact Concierge, Promo Code logic) |

---

## 🎨 Key Application Features

### 1. Modern E-Commerce UI/UX
- **Responsive Layout**: Designed mobile-first with adaptive drawers, hamburger navigation, slide-over cart, and modal quick views.
- **Visual Hierarchy & Typography**: Curated dark & light modes, high-contrast typography, star rating chips, price discount tags, and product badges (*New*, *Best Seller*).
- **Hero Showcase & Category Bar**: Instant switching between sub-brands with live item counts.

### 2. Frontend Development & Functionality
- **Product Search**: Real-time debounced multi-field search across titles, descriptions, categories, and tags.
- **Multi-Dimensional Filtering**: Filter by category, Slekco sub-brand, price range slider, in-stock status, and sort options (*Price Low/High, Rating, Newest, Featured*).
- **Product Details & Quick View Modal**: Interactive image gallery with thumbnails, color/size variant pickers, stock indicators, and specifications matrix.
- **Dedicated Detail Pages**: Dynamic route at `/product/[id]` with static generation and related product recommendations.
- **Shopping Cart & Checkout**:
  - Slide-over cart drawer with quantity increments/decrements and removal.
  - Promo code system (`SLEKCO10` for 10% off, `VIP20` for 20% off, `FREESHIP` for free shipping).
  - Dynamic total calculation: Subtotal + Discount + Shipping Fee + 8% Tax.
  - Express checkout modal with field validation and simulated payment options (Card, PayPal, COD).

### 3. Backend / API Architecture
The frontend consumes server-side REST API endpoints:
- `GET /api/products`: Supports search, category, brand, min/max price, in-stock, and sorting query parameters.
- `GET /api/products/[id]`: Returns single product payload and related products.
- `GET /api/categories`: Returns categories and sub-brand taxonomy metadata.
- `POST /api/orders`: Validates cart item IDs, computes backend prices, applies discount rules, generates order ID (`SLK-ORD-XXXXXX`), and returns confirmation invoice.
- `POST /api/contact`: Handles support lead capture with email validation and generates ticket references (`SLK-TCK-XXXX`).
- `GET /api/schema`: Serves the database schema object for live inspectability.

---

## 🗄️ Database Architecture & Schema (Assessment Requirement #4)

The application structures data across five relational entities (**Users**, **Categories**, **Products**, **Orders**, and **OrderItems**).

```
+------------------+         +--------------------+         +-------------------+
|      USERS       |         |     CATEGORIES     |         |     PRODUCTS      |
+------------------+         +--------------------+         +-------------------+
| id (PK)          |         | id (PK)            |         | id (PK)           |
| email (Unique)   |         | name               |----+    | category_id (FK)  |
| password_hash    |         | slug (Unique)      |    |    | brand             |
| full_name        |         +--------------------+    +--->| name, price, stock|
| role (CUSTOMER)  |                                        +-------------------+
+------------------+                                                  |
         |                                                            |
         v                                                            v
+------------------+                                        +-------------------+
|      ORDERS      |--------------------------------------->|    ORDER_ITEMS    |
+------------------+                                        +-------------------+
| id (PK)          |                                        | id (PK)           |
| user_id (FK)     |                                        | order_id (FK)     |
| order_number     |                                        | product_id (FK)   |
| total_amount     |                                        | quantity, price   |
| status           |                                        +-------------------+
+------------------+
```

An interactive **DB Schema Viewer** is built directly into the header navigation (`DB Schema` button) allowing technical assessors to view table definitions, column types, foreign key constraints, and raw Prisma schema code.

---

## 🤖 AI-Assisted Development Workflow (Assessment Requirement #6)

### AI Tools Utilized
- **Gemini / Cursor / Copilot**: Used for rapid component scaffolding, TypeScript interface definitions, mock product generation, and API handler creation.

### Where AI Helped Most
1. **Curated Product Taxonomy**: Generating realistic specifications, feature lists, and high-resolution product image assets across 4 distinct brand verticals.
2. **Schema & API Blueprinting**: Scaffolding relational database tables, Prisma model syntax, and Next.js Route Handlers.
3. **Responsive UI & CSS Architecture**: Crafting smooth Tailwind CSS transitions, glassmorphic header navigation, and slide-over drawers.

### Example of AI-Generated Solution Modified & Improved
- **Initial AI Code**: The initial AI suggestion performed cart calculations and order confirmation entirely on the client side inside React state, passing arbitrary total prices to the order handler.
- **Developer Refactoring & Improvement**: Refactored the architecture to execute order verification on the server side inside `src/app/api/orders/route.ts`. The backend now looks up product IDs from the authoritative product database, recalculates unit prices and subtotal securely, re-validates promo code eligibility on the server, and computes tax/shipping to prevent price tampering or client-side manipulation.

---

## 🚀 Setup & Local Installation

### Prerequisites
- Node.js `v18.x` or higher
- `npm` package manager

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/slekco-ecommerce.git
   cd slekco-ecommerce
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build Production Bundle**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Live Deployment Link

- **Vercel Live URL**: [https://slekco-ecommerce.vercel.app](https://slekco-ecommerce.vercel.app)
