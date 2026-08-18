import { NextResponse } from 'next/server';
import { CATEGORIES, BRANDS } from '@/data/products';

export async function GET() {
  return NextResponse.json({
    success: true,
    categories: CATEGORIES,
    brands: BRANDS,
  });
}
