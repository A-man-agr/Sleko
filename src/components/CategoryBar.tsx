'use client';

import React from 'react';
import { CATEGORIES, BRANDS } from '@/data/products';
import { FilterState } from '@/types/product';
import { FilterIcon } from './Icons';

interface CategoryBarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onToggleMobileFilters: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  filters,
  onFilterChange,
  onToggleMobileFilters,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isActive = filters.category.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.slug })}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-indigo-600 dark:text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-300 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-slate-300'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Brand Selector & Filter Mobile Button & Sorting */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Brand Dropdown */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Brand:</span>
            <select
              value={filters.brand}
              onChange={(e) => onFilterChange({ brand: e.target.value })}
              className="text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Sort:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              className="text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={onToggleMobileFilters}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800"
          >
            <FilterIcon className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
