'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { SearchIcon, RotateCcwIcon, XIcon } from './Icons';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onQuickView: (product: Product) => void;
  onResetFilters: () => void;
  searchQuery?: string;
  activeCategory?: string;
  activeBrand?: string;
  onRemoveSearch?: () => void;
  onRemoveCategory?: () => void;
  onRemoveBrand?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onQuickView,
  onResetFilters,
  searchQuery,
  activeCategory,
  activeBrand,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveBrand,
}) => {
  const hasActiveFilters =
    (searchQuery && searchQuery.trim() !== '') ||
    (activeCategory && activeCategory !== 'all') ||
    (activeBrand && activeBrand !== 'all');

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
      {/* Active Filter Bar & Item Count Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{products.length}</strong> items
          </span>

          {/* Active Filter Pills */}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/50 dark:border-indigo-800">
              Query: &quot;{searchQuery}&quot;
              {onRemoveSearch && (
                <button onClick={onRemoveSearch} className="hover:text-indigo-900 dark:hover:text-white">
                  <XIcon className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          {activeCategory && activeCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-zinc-700 capitalize">
              Category: {activeCategory}
              {onRemoveCategory && (
                <button onClick={onRemoveCategory} className="hover:text-rose-600">
                  <XIcon className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          {activeBrand && activeBrand !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/50 dark:border-emerald-800">
              Brand: {activeBrand}
              {onRemoveBrand && (
                <button onClick={onRemoveBrand} className="hover:text-emerald-900 dark:hover:text-white">
                  <XIcon className="w-3 h-3" />
                </button>
              )}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <RotateCcwIcon className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>
    </div>
  );
};
