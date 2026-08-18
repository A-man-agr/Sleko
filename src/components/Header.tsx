'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  ShoppingBagIcon,
  SearchIcon,
  HeartIcon,
  MenuIcon,
  XIcon,
  DatabaseIcon,
  SparklesIcon,
} from './Icons';

interface HeaderProps {
  onOpenSchemaModal?: () => void;
  onOpenContactModal?: () => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSchemaModal,
  onOpenContactModal,
  onSearchChange,
  searchQuery = '',
  onSelectCategory,
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleNavCategoryClick = (catSlug: string) => {
    if (onSelectCategory) {
      onSelectCategory(catSlug);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90 transition-colors">
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2 tracking-wide font-medium">
        <SparklesIcon className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        <span>Slekco Multipurpose Store — Free express global shipping on orders over $100</span>
        <span className="hidden sm:inline-block bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded text-[10px] font-mono border border-indigo-400/30">
          CODE: SLEKCO10
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand & Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-xl tracking-tight shadow-md group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white font-sans">
                SLEKCO<span className="text-indigo-600 dark:text-indigo-400">.</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase -mt-1">
                Luxe • Tech • Living • Glow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => handleNavCategoryClick('all')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              All Products
            </button>
            <button
              onClick={() => handleNavCategoryClick('electronics')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Tech
            </button>
            <button
              onClick={() => handleNavCategoryClick('fashion')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Fashion
            </button>
            <button
              onClick={() => handleNavCategoryClick('home')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home & Living
            </button>
            <button
              onClick={() => handleNavCategoryClick('beauty')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Beauty
            </button>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border transition-all ${
              isSearchFocused
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-zinc-950'
                : 'border-slate-200 dark:border-zinc-800'
            }`}
          >
            <SearchIcon className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, brands (e.g. Headphones, Slekco Luxe)..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange && onSearchChange('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* DB Schema trigger button (Assessment Requirement #4) */}
          <button
            onClick={onOpenSchemaModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 transition-colors"
            title="View Database Architecture & Schema"
          >
            <DatabaseIcon className="w-4 h-4" />
            <span>DB Schema</span>
          </button>

          {/* Contact Concierge Trigger */}
          <button
            onClick={onOpenContactModal}
            className="hidden sm:inline-block text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 px-2 py-1"
          >
            Contact
          </button>

          {/* Wishlist Button */}
          <div className="relative">
            <button
              onClick={() => handleNavCategoryClick('all')}
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors relative"
              aria-label="Wishlist"
            >
              <HeartIcon className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 hover:bg-slate-800 transition-colors shadow-md relative group"
            aria-label="Shopping Cart"
          >
            <ShoppingBagIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold hidden sm:inline-block">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-indigo-500 text-white dark:bg-white dark:text-slate-900 rounded-full text-[11px] font-extrabold flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search input bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <SearchIcon className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Categories</div>
          <button
            onClick={() => handleNavCategoryClick('all')}
            className="block w-full text-left px-3 py-2 rounded-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            All Products
          </button>
          <button
            onClick={() => handleNavCategoryClick('electronics')}
            className="block w-full text-left px-3 py-2 rounded-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            Tech & Electronics
          </button>
          <button
            onClick={() => handleNavCategoryClick('fashion')}
            className="block w-full text-left px-3 py-2 rounded-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            Fashion & Apparel
          </button>
          <button
            onClick={() => handleNavCategoryClick('home')}
            className="block w-full text-left px-3 py-2 rounded-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            Home & Living
          </button>
          <button
            onClick={() => handleNavCategoryClick('beauty')}
            className="block w-full text-left px-3 py-2 rounded-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900"
          >
            Beauty & Skincare
          </button>

          <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => {
                if (onOpenSchemaModal) onOpenSchemaModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
            >
              <DatabaseIcon className="w-4 h-4" />
              <span>DB Schema</span>
            </button>
            <button
              onClick={() => {
                if (onOpenContactModal) onOpenContactModal();
                setMobileMenuOpen(false);
              }}
              className="text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              Contact Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
