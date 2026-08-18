'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { CartProvider, useCart } from '@/context/CartContext';
import { WishlistProvider, useWishlist } from '@/context/WishlistContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ContactModal } from '@/components/ContactModal';
import { DatabaseSchemaModal } from '@/components/DatabaseSchemaModal';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import {
  StarIcon,
  ShoppingBagIcon,
  HeartIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  TruckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  ArrowRightIcon,
} from '@/components/Icons';

interface ProductClientPageProps {
  product: Product;
  relatedProducts: Product[];
}

function ProductClientContent({
  product,
  relatedProducts,
}: ProductClientPageProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const activeColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : '');
  const activeSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, activeColor, activeSize);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col">
      <Header
        onOpenSchemaModal={() => setIsSchemaOpen(true)}
        onOpenContactModal={() => setIsContactOpen(true)}
      />

      {/* Main Product Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-slate-900 dark:text-white line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-sm">
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buying & Config Column */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <span>{product.brand}</span>
                <span className="text-slate-400 font-normal">{product.category}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {product.rating}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  ({product.reviewCount} verified reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  In Stock ({product.stockCount} left)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-slate-400 line-through font-mono">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Selected Color: <span className="text-indigo-600 dark:text-indigo-400">{activeColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          activeColor === color
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-500'
                            : 'border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Selected Size: <span className="text-indigo-600 dark:text-indigo-400">{activeSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl text-xs font-bold border flex items-center justify-center transition-all ${
                          activeSize === size
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                            : 'border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Bullet List */}
              {product.features && product.features.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Product Highlights
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Buying Action Box */}
            <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-800"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-sm text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-800"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedSuccess
                      ? 'bg-emerald-600'
                      : 'bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 animate-bounce" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBagIcon className="w-5 h-5" />
                      <span>Add to Bag • ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-4 rounded-xl border transition-colors ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-800'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <HeartIcon className="w-5 h-5" filled={isFavorite} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-1">
                  <TruckIcon className="w-5 h-5 text-indigo-500 mx-auto" />
                  <div className="font-bold text-slate-700 dark:text-slate-300">Free Express</div>
                  <div className="text-[10px]">Over $100</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-1">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-500 mx-auto" />
                  <div className="font-bold text-slate-700 dark:text-slate-300">2-Yr Warranty</div>
                  <div className="text-[10px]">Full Coverage</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 space-y-1">
                  <RotateCcwIcon className="w-5 h-5 text-amber-500 mx-auto" />
                  <div className="font-bold text-slate-700 dark:text-slate-300">30-Day Return</div>
                  <div className="text-[10px]">Money Back</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Technical Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">{key}</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                You May Also Like
              </h3>
              <Link href="/" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                View All Catalog <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} onQuickView={(p) => setQuickViewProduct(p)} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer
        onOpenSchemaModal={() => setIsSchemaOpen(true)}
        onOpenContactModal={() => setIsContactOpen(true)}
      />

      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <DatabaseSchemaModal isOpen={isSchemaOpen} onClose={() => setIsSchemaOpen(false)} />
      <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

export function ProductClientPage(props: ProductClientPageProps) {
  return (
    <CartProvider>
      <WishlistProvider>
        <ProductClientContent {...props} />
      </WishlistProvider>
    </CartProvider>
  );
}
