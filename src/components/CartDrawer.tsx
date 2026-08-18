'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { XIcon, TrashIcon, PlusIcon, MinusIcon, ShoppingBagIcon, ArrowRightIcon, CheckCircleIcon } from './Icons';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountCode,
    discountAmount,
    applyDiscount,
    removeDiscount,
    shippingFee,
    taxAmount,
    totalPrice,
    cartCount,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ success?: boolean; message?: string }>({});

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscount(promoInput);
    setPromoStatus(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-950 shadow-2xl flex flex-col border-l border-slate-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBagIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Your Bag <span className="text-sm font-normal text-slate-400">({cartCount})</span>
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-900"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBagIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Looks like you haven&apos;t added any products to your cart yet.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
                  className="flex gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 pr-6">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                          }
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                          aria-label="Remove item"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 space-x-2 mt-0.5">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-slate-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-l-lg"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedColor,
                              item.selectedSize
                            )
                          }
                          className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-r-lg"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. SLEKCO10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </div>
                {promoStatus.message && (
                  <p
                    className={`text-[11px] font-medium ${
                      promoStatus.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                    }`}
                  >
                    {promoStatus.message}
                  </p>
                )}
                {discountCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 pt-1">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircleIcon className="w-3.5 h-3.5" /> Promo &quot;{discountCode}&quot; Active
                    </span>
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-[10px] underline text-slate-400 hover:text-slate-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Calculations Table */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono font-bold">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Tax (8%)</span>
                  <span className="font-mono font-bold">${taxAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-base font-extrabold">
                  <span>Total</span>
                  <span className="font-mono text-xl text-indigo-600 dark:text-indigo-400">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onOpenCheckout();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-center"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
