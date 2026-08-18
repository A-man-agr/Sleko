import React from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { ProductClientPage } from './ProductClientPage';

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product Not Found</h1>
          <p className="text-sm text-slate-500">The product you are looking for does not exist.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 3);

  return <ProductClientPage product={product} relatedProducts={relatedProducts} />;
}
