import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }

  // Related products from same category or brand
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 4);

  return NextResponse.json({
    success: true,
    product,
    relatedProducts,
  });
}
