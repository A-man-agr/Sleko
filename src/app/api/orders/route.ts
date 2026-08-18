import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';
import { CheckoutFormData, OrderItemInput } from '@/types/product';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, discountCode }: { customer: CheckoutFormData; items: OrderItemInput[]; discountCode?: string } = body;

    // 1. Basic Form Validation
    if (!customer || !customer.fullName || !customer.email || !customer.address || !customer.city) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required customer address fields.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty. Please add products to your order.' },
        { status: 400 }
      );
    }

    // 2. Compute backend subtotal & verify stock
    let subtotal = 0;
    const validatedItems = items.map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ID ${item.productId} not found`);
      }
      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      return {
        product,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      };
    });

    // 3. Discount calculation
    let discountPercent = 0;
    if (discountCode === 'SLEKCO10') discountPercent = 10;
    if (discountCode === 'VIP20') discountPercent = 20;

    const discountAmount = (subtotal * discountPercent) / 100;
    const shipping = subtotal > 100 || discountCode === 'FREESHIP' ? 0 : 15;
    const tax = (subtotal - discountAmount) * 0.08;
    const total = subtotal - discountAmount + shipping + tax;

    // 4. Generate order confirmation ID
    const orderId = `SLK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    const orderConfirmation = {
      orderId,
      createdAt: new Date().toISOString(),
      customer,
      items: validatedItems,
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      status: 'Confirmed',
      estimatedDelivery,
    };

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully!',
      order: orderConfirmation,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server order processing failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
