'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types/product';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  discountCode: string;
  discountPercent: number;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalPrice: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'slekco_cart_v1';
const DISCOUNT_KEY = 'slekco_discount_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [discountState, setDiscountState] = useState<{ code: string; percent: number }>(() => {
    if (typeof window === 'undefined') return { code: '', percent: 0 };
    try {
      const savedDiscount = localStorage.getItem(DISCOUNT_KEY);
      return savedDiscount ? JSON.parse(savedDiscount) : { code: '', percent: 0 };
    } catch {
      return { code: '', percent: 0 };
    }
  });

  const discountCode = discountState.code;
  const discountPercent = discountState.percent;

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
      if (discountCode) {
        localStorage.setItem(DISCOUNT_KEY, JSON.stringify({ code: discountCode, percent: discountPercent }));
      } else {
        localStorage.removeItem(DISCOUNT_KEY);
      }
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cart, discountCode, discountPercent]);

  const addToCart = (product: Product, quantity: number = 1, color?: string, size?: string) => {
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor, selectedSize }];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyDiscount = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SLEKCO10') {
      setDiscountState({ code: 'SLEKCO10', percent: 10 });
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'VIP20') {
      setDiscountState({ code: 'VIP20', percent: 20 });
      return { success: true, message: '20% VIP discount applied!' };
    } else if (cleanCode === 'FREESHIP') {
      setDiscountState({ code: 'FREESHIP', percent: 0 });
      return { success: true, message: 'Free Shipping promo applied!' };
    } else {
      return { success: false, message: 'Invalid promo code. Try SLEKCO10 or VIP20' };
    }
  };

  const removeDiscount = () => {
    setDiscountState({ code: '', percent: 0 });
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const isFreeShipPromo = discountCode === 'FREESHIP';
  const shippingFee = subtotal > 100 || isFreeShipPromo || cart.length === 0 ? 0 : 15;
  const taxAmount = (subtotal - discountAmount) * 0.08;
  const totalPrice = Math.max(0, subtotal - discountAmount + shippingFee + taxAmount);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        discountCode,
        discountPercent,
        applyDiscount,
        removeDiscount,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        totalPrice,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
