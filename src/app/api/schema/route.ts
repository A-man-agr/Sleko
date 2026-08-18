import { NextResponse } from 'next/server';

export async function GET() {
  const dbSchema = {
    database: 'slekco_ecommerce_db',
    dialect: 'PostgreSQL / Prisma / MySQL',
    tables: [
      {
        name: 'users',
        description: 'Customer profiles, authentication credentials, and address records',
        columns: [
          { name: 'id', type: 'UUID / STRING', primaryKey: true, nullable: false },
          { name: 'email', type: 'VARCHAR(255)', unique: true, nullable: false },
          { name: 'password_hash', type: 'VARCHAR(255)', nullable: false },
          { name: 'full_name', type: 'VARCHAR(100)', nullable: false },
          { name: 'phone', type: 'VARCHAR(20)', nullable: true },
          { name: 'role', type: 'ENUM(CUSTOMER, ADMIN)', default: 'CUSTOMER' },
          { name: 'created_at', type: 'TIMESTAMP', default: 'NOW()' },
          { name: 'updated_at', type: 'TIMESTAMP', default: 'NOW()' },
        ],
      },
      {
        name: 'categories',
        description: 'Product categories and brand taxonomy',
        columns: [
          { name: 'id', type: 'UUID / STRING', primaryKey: true, nullable: false },
          { name: 'name', type: 'VARCHAR(100)', nullable: false },
          { name: 'slug', type: 'VARCHAR(100)', unique: true, nullable: false },
          { name: 'description', type: 'TEXT', nullable: true },
          { name: 'image_url', type: 'TEXT', nullable: true },
          { name: 'created_at', type: 'TIMESTAMP', default: 'NOW()' },
        ],
      },
      {
        name: 'products',
        description: 'Inventory items, multi-brand specs, pricing, and stock',
        columns: [
          { name: 'id', type: 'UUID / STRING', primaryKey: true, nullable: false },
          { name: 'category_id', type: 'UUID / STRING', foreignKey: 'categories.id' },
          { name: 'brand', type: 'VARCHAR(100)', nullable: false },
          { name: 'name', type: 'VARCHAR(255)', nullable: false },
          { name: 'slug', type: 'VARCHAR(255)', unique: true, nullable: false },
          { name: 'description', type: 'TEXT', nullable: false },
          { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'original_price', type: 'DECIMAL(10,2)', nullable: true },
          { name: 'stock_count', type: 'INTEGER', default: 0 },
          { name: 'is_featured', type: 'BOOLEAN', default: false },
          { name: 'is_new', type: 'BOOLEAN', default: false },
          { name: 'images', type: 'JSONB / ARRAY', nullable: false },
          { name: 'specifications', type: 'JSONB', nullable: true },
          { name: 'colors', type: 'ARRAY', nullable: true },
          { name: 'sizes', type: 'ARRAY', nullable: true },
          { name: 'created_at', type: 'TIMESTAMP', default: 'NOW()' },
        ],
      },
      {
        name: 'orders',
        description: 'Customer purchase history, payment status, and shipping information',
        columns: [
          { name: 'id', type: 'UUID / STRING', primaryKey: true, nullable: false },
          { name: 'user_id', type: 'UUID / STRING', foreignKey: 'users.id', nullable: true },
          { name: 'order_number', type: 'VARCHAR(50)', unique: true, nullable: false },
          { name: 'customer_name', type: 'VARCHAR(100)', nullable: false },
          { name: 'customer_email', type: 'VARCHAR(255)', nullable: false },
          { name: 'shipping_address', type: 'TEXT', nullable: false },
          { name: 'city', type: 'VARCHAR(100)', nullable: false },
          { name: 'postal_code', type: 'VARCHAR(20)', nullable: false },
          { name: 'subtotal', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'discount_amount', type: 'DECIMAL(10,2)', default: 0.00 },
          { name: 'shipping_fee', type: 'DECIMAL(10,2)', default: 0.00 },
          { name: 'tax_amount', type: 'DECIMAL(10,2)', default: 0.00 },
          { name: 'total_amount', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'status', type: 'ENUM(PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)', default: 'CONFIRMED' },
          { name: 'payment_method', type: 'VARCHAR(50)', default: 'CARD' },
          { name: 'created_at', type: 'TIMESTAMP', default: 'NOW()' },
        ],
      },
      {
        name: 'order_items',
        description: 'Junction table linking orders with individual line items and selected variations',
        columns: [
          { name: 'id', type: 'UUID / STRING', primaryKey: true, nullable: false },
          { name: 'order_id', type: 'UUID / STRING', foreignKey: 'orders.id' },
          { name: 'product_id', type: 'UUID / STRING', foreignKey: 'products.id' },
          { name: 'quantity', type: 'INTEGER', nullable: false },
          { name: 'unit_price', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'selected_color', type: 'VARCHAR(50)', nullable: true },
          { name: 'selected_size', type: 'VARCHAR(50)', nullable: true },
        ],
      },
    ],
  };

  return NextResponse.json({
    success: true,
    schema: dbSchema,
  });
}
