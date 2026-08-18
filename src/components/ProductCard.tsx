'use client';

import React from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { StarIcon, HeartIcon, ShoppingBagIcon, EyeIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-zinc-900/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-zinc-800'
          }`}
          aria-label="Add to Wishlist"
        >
          <HeartIcon className="w-4 h-4" filled={isFavorite} />
        </button>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={() => onQuickView(product)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <EyeIcon className="w-4 h-4 text-indigo-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-1">
            <span>{product.brand}</span>
            <span className="text-slate-400 font-normal">{product.category}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center">
              <StarIcon className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {product.rating}
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Price & Add To Cart Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through -mt-1 font-mono">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingBagIcon className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
