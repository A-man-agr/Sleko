'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  XIcon,
  StarIcon,
  ShoppingBagIcon,
  HeartIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  TruckIcon,
  ShieldCheckIcon,
} from './Icons';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  if (!product) return null;

  const activeColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : '');
  const activeSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, activeColor, activeSize);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 my-8 z-10 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
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

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900">
                <TruckIcon className="w-4 h-4 text-indigo-500" />
                <span>Express Shipping</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                <span>Authentic Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right: Details & Buying Controls */}
          <div className="space-y-5 flex flex-col justify-between">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <span>{product.brand}</span>
                <span className="text-slate-400 font-normal">{product.category}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {product.rating}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  ({product.reviewCount} customer reviews)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  In Stock ({product.stockCount} available)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-slate-400 line-through font-mono">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-3">
                {product.description}
              </p>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4 space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Color: <span className="text-indigo-600 dark:text-indigo-400">{activeColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
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

              {/* Size Options */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4 space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Size: <span className="text-indigo-600 dark:text-indigo-400">{activeSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded-lg text-xs font-bold border flex items-center justify-center transition-all ${
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

              {/* Highlights Bullet List */}
              {product.features && product.features.length > 0 && (
                <div className="mt-4 space-y-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Key Features
                  </label>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Buying Action Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-zinc-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md ${
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

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    isFavorite
                      ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-800'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <HeartIcon className="w-5 h-5" filled={isFavorite} />
                </button>
              </div>

              {/* Full Page Link */}
              <div className="text-center pt-1">
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View full dedicated product page & specs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
