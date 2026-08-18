'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CheckoutFormData, OrderConfirmation } from '@/types/product';
import { XIcon, CheckCircleIcon, ShieldCheckIcon } from './Icons';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, discountCode, totalPrice, subtotal, discountAmount, shippingFee, taxAmount, clearCart } =
    useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: 'card',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: formData,
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          selectedColor: i.selectedColor,
          selectedSize: i.selectedSize,
        })),
        discountCode,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success) {
        setOrderConfirmation(data.order);
        clearCart();
      } else {
        alert(data.error || 'Failed to process order.');
      }
    } catch {
      alert('Network error while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => !orderConfirmation && onClose()}
      />

      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 my-8 z-10 animate-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-900">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {orderConfirmation ? 'Order Confirmed!' : 'Express Checkout'}
            </h2>
            <p className="text-xs text-slate-500">
              {orderConfirmation
                ? `Order ID: ${orderConfirmation.orderId}`
                : 'Secure encrypted 256-bit order submission'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        {orderConfirmation ? (
          /* Order Confirmation View */
          <div className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircleIcon className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Thank you for your order, {orderConfirmation.customer.fullName.split(' ')[0]}!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                A confirmation email has been sent to{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {orderConfirmation.customer.email}
                </span>
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between border-b pb-2 dark:border-zinc-800 font-sans">
                <span className="font-bold text-slate-500">Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {orderConfirmation.status}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2 dark:border-zinc-800 font-sans">
                <span className="font-bold text-slate-500">Est. Delivery</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {orderConfirmation.estimatedDelivery}
                </span>
              </div>
              <div className="space-y-1 font-sans">
                <span className="font-bold text-slate-500 block mb-1">Purchased Items:</span>
                {orderConfirmation.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 dark:border-zinc-800 flex justify-between font-extrabold text-sm font-sans">
                <span>Total Paid</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  ${orderConfirmation.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Step 1: Customer Contact */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                1. Customer & Shipping Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border ${
                      errors.fullName ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-800'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border ${
                      errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-800'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Luxury Ave, Suite 400"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border ${
                      errors.address ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-800'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                  {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-1234"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border ${
                      errors.city ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-800'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                  {errors.city && <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="10001"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border ${
                      errors.postalCode ? 'border-rose-500' : 'border-slate-200 dark:border-zinc-800'
                    } focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  />
                  {errors.postalCode && <p className="text-[11px] text-rose-500 mt-1">{errors.postalCode}</p>}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:outline-none"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                2. Payment Method Simulation
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card' as const, name: 'Credit Card', sub: 'Visa, MC, Amex' },
                  { id: 'paypal' as const, name: 'PayPal', sub: 'Instant Express' },
                  { id: 'cod' as const, name: 'Cash on Delivery', sub: 'Pay on arrival' },
                ].map((pm) => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.paymentMethod === pm.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{pm.name}</div>
                    <div className="text-[10px] text-slate-400">{pm.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-mono font-bold">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Estimated Tax</span>
                <span className="font-mono font-bold">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white text-base font-black">
                <span>Total Amount Due</span>
                <span className="font-mono text-xl text-indigo-600 dark:text-indigo-400">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <ShieldCheckIcon className="w-5 h-5" />
              <span>
                {isSubmitting ? 'Processing Payment & Order...' : `Place Order • $${totalPrice.toFixed(2)}`}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
