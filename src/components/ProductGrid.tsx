'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { SearchIcon, RotateCcwIcon } from './Icons';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onQuickView: (product: Product) => void;
  onResetFilters: () => void;
  searchQuery?: string;
  activeCategory?: string;
  activeBrand?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onQuickView,
  onResetFilters,
  searchQuery,
  activeCategory,
  activeBrand,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-80 rounded-2xl bg-slate-200 dark:bg-zinc-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto">
          <SearchIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No products found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We couldn&apos;t find any products matching your current filters
          {searchQuery ? ` for "${searchQuery}"` : ''}.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-md"
        >
          <RotateCcwIcon className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Filter / Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-white">{products.length}</span> items
          {activeCategory && activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
          {activeBrand && activeBrand !== 'all' ? ` • ${activeBrand}` : ''}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </div>
  );
};
