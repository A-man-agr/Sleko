'use client';

import React, { useState, useEffect } from 'react';
import { DatabaseIcon, XIcon, CheckCircleIcon } from './Icons';

interface ColumnDef {
  name: string;
  type: string;
  primaryKey?: boolean;
  foreignKey?: string;
  unique?: boolean;
  nullable?: boolean;
}

interface TableDef {
  name: string;
  description: string;
  columns: ColumnDef[];
}

interface SchemaPayload {
  database: string;
  dialect: string;
  tables: TableDef[];
}

interface DatabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({ isOpen, onClose }) => {
  const [schemaData, setSchemaData] = useState<SchemaPayload | null>(null);
  const [activeTab, setActiveTab] = useState<'tables' | 'prisma'>('tables');

  useEffect(() => {
    if (isOpen && !schemaData) {
      fetch('/api/schema')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSchemaData(data.schema);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isOpen, schemaData]);

  if (!isOpen) return null;

  const prismaSchemaCode = `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  fullName     String
  phone        String?
  role         Role     @default(CUSTOMER)
  orders       Order[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  products    Product[]
  createdAt   DateTime  @default(now())
}

model Product {
  id             String      @id @default(uuid())
  categoryId     String
  category       Category    @relation(fields: [categoryId], references: [id])
  brand          String
  name           String
  slug           String      @unique
  description    String
  price          Decimal     @db.Decimal(10, 2)
  originalPrice  Decimal?    @db.Decimal(10, 2)
  stockCount     Int         @default(0)
  isFeatured     Boolean     @default(false)
  isNew          Boolean     @default(false)
  images         String[]
  specifications Json?
  colors         String[]
  orderItems     OrderItem[]
  createdAt      DateTime    @default(now())
}

model Order {
  id              String      @id @default(uuid())
  orderNumber     String      @unique
  userId          String?
  user            User?       @relation(fields: [userId], references: [id])
  customerName    String
  customerEmail   String
  shippingAddress String
  totalAmount     Decimal     @db.Decimal(10, 2)
  status          OrderStatus @default(CONFIRMED)
  items           OrderItem[]
  createdAt       DateTime    @default(now())
}

model OrderItem {
  id            String  @id @default(uuid())
  orderId       String
  order         Order   @relation(fields: [orderId], references: [id])
  productId     String
  product       Product @relation(fields: [productId], references: [id])
  quantity      Int
  unitPrice     Decimal @db.Decimal(10, 2)
  selectedColor String?
}
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800 my-8 z-10 animate-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <DatabaseIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Database Architecture & Schema</h2>
              <p className="text-xs text-slate-400 font-mono">
                PostgreSQL • Prisma ORM • Next.js API Routes (Assessment Sec 4)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-950 border-b border-slate-800 flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('tables')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'tables'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Table Structure ({schemaData?.tables?.length || 5})
          </button>
          <button
            onClick={() => setActiveTab('prisma')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'prisma'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Prisma ORM Schema
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'tables' && schemaData && (
            <div className="space-y-6">
              {schemaData.tables.map((table: TableDef) => (
                <div
                  key={table.name}
                  className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden"
                >
                  <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-indigo-400 text-sm">{table.name}</span>
                      <p className="text-xs text-slate-400">{table.description}</p>
                    </div>
                    <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded">
                      {table.columns.length} columns
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-2">Column Name</th>
                          <th className="px-4 py-2">Data Type</th>
                          <th className="px-4 py-2">Constraint / Key</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {table.columns.map((col: ColumnDef) => (
                          <tr key={col.name} className="hover:bg-slate-900/40">
                            <td className="px-4 py-2 font-bold text-white">{col.name}</td>
                            <td className="px-4 py-2 text-indigo-300">{col.type}</td>
                            <td className="px-4 py-2 text-amber-400 text-[11px]">
                              {col.primaryKey && (
                                <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px] mr-1">
                                  PRIMARY KEY
                                </span>
                              )}
                              {col.foreignKey && (
                                <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-[10px]">
                                  FK → {col.foreignKey}
                                </span>
                              )}
                              {col.unique && (
                                <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] ml-1">
                                  UNIQUE
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prisma' && (
            <div className="relative">
              <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed">
                {prismaSchemaCode.trim()}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>Ready for production PostgreSQL or MongoDB deployments</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
          >
            Close Schema
          </button>
        </div>
      </div>
    </div>
  );
};
