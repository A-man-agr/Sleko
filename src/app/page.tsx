'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CategoryBar } from '@/components/CategoryBar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ContactModal } from '@/components/ContactModal';
import { DatabaseSchemaModal } from '@/components/DatabaseSchemaModal';
import { Footer } from '@/components/Footer';
import { Product, FilterState } from '@/types/product';
import { PRODUCTS } from '@/data/products';

function MainApp() {
  const catalogRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isSchemaOpen, setIsSchemaOpen] = useState<boolean>(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    brand: 'all',
    minPrice: 0,
    maxPrice: 500,
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Client-side API fetch with clean async loading
  useEffect(() => {
    let isSubscribed = true;
    const queryParams = new URLSearchParams();
    if (filters.searchQuery) queryParams.set('q', filters.searchQuery);
    if (filters.category) queryParams.set('category', filters.category);
    if (filters.brand) queryParams.set('brand', filters.brand);
    if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.inStockOnly) queryParams.set('inStock', 'true');
    if (filters.sortBy) queryParams.set('sort', filters.sortBy);

    fetch(`/api/products?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isSubscribed && data.success) {
          setProducts(data.products);
        }
      })
      .catch((err) => {
        console.error('API fetch error, using local fallback:', err);
      })
      .finally(() => {
        if (isSubscribed) {
          setIsLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [filters]);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setIsLoading(true);
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({
      searchQuery: '',
      category: 'all',
      brand: 'all',
      minPrice: 0,
      maxPrice: 500,
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenSchemaModal={() => setIsSchemaOpen(true)}
        onOpenContactModal={() => setIsContactOpen(true)}
        onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
        searchQuery={filters.searchQuery}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => {
          handleFilterChange({ category: cat });
          scrollToCatalog();
        }}
      />

      {/* Hero Showcase */}
      <Hero
        onExploreClick={scrollToCatalog}
        onSelectCategory={(cat) => {
          handleFilterChange({ category: cat });
          scrollToCatalog();
        }}
      />

      {/* Category Bar */}
      <CategoryBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onToggleMobileFilters={() => setIsMobileFiltersOpen(true)}
      />

      {/* Main Catalog Section */}
      <section ref={catalogRef} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            isMobileOpen={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onQuickView={(p) => setQuickViewProduct(p)}
              onResetFilters={handleResetFilters}
              searchQuery={filters.searchQuery}
              activeCategory={filters.category}
              activeBrand={filters.brand}
              onRemoveSearch={() => handleFilterChange({ searchQuery: '' })}
              onRemoveCategory={() => handleFilterChange({ category: 'all' })}
              onRemoveBrand={() => handleFilterChange({ brand: 'all' })}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onOpenSchemaModal={() => setIsSchemaOpen(true)}
        onOpenContactModal={() => setIsContactOpen(true)}
        onSelectCategory={(cat) => {
          handleFilterChange({ category: cat });
          scrollToCatalog();
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Modals */}
      <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <DatabaseSchemaModal isOpen={isSchemaOpen} onClose={() => setIsSchemaOpen(false)} />
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <WishlistProvider>
        <MainApp />
      </WishlistProvider>
    </CartProvider>
  );
}
