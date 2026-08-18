'use client';

import React from 'react';
import { FilterState } from '@/types/product';
import { CATEGORIES, BRANDS } from '@/data/products';
import { RotateCcwIcon, XIcon } from './Icons';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const sidebarContent = (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <span>Filter Products</span>
        </h3>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <RotateCcwIcon className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Slekco Brand
        </label>
        <div className="space-y-1.5">
          {BRANDS.map((brand) => {
            const isSelected = filters.brand.toLowerCase() === brand.toLowerCase();
            return (
              <label
                key={brand}
                className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="brandFilter"
                    checked={isSelected}
                    onChange={() => onFilterChange({ brand: brand === 'All Brands' ? 'all' : brand })}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-zinc-700"
                  />
                  <span className={isSelected ? 'font-semibold text-slate-900 dark:text-white' : ''}>
                    {brand}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.slug })}
                className={`w-full text-left text-sm px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-slate-400 font-mono">({cat.itemCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Max Price</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
            ${filters.maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="20"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>$20</span>
          <span>$250</span>
          <span>$500+</span>
        </div>
      </div>

      {/* In-Stock Only Toggle */}
      <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 dark:border-zinc-700"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs h-fit">
        {sidebarContent}
      </div>

      {/* Mobile Slide-over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-zinc-950 p-6 shadow-xl flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
              <button
                onClick={onCloseMobile}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
