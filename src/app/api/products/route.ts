import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category')?.toLowerCase() || 'all';
  const brand = searchParams.get('brand')?.toLowerCase() || 'all';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000');
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'featured';

  let filtered = [...PRODUCTS];

  // 1. Search Query Filter
  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  // 2. Category Filter
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category);
  }

  // 3. Brand Filter
  if (brand && brand !== 'all' && brand !== 'all brands') {
    filtered = filtered.filter((p) => p.brand.toLowerCase() === brand);
  }

  // 4. Price Filter
  filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  // 5. In Stock Only
  if (inStockOnly) {
    filtered = filtered.filter((p) => p.inStock);
  }

  // 6. Sorting
  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'featured':
    default:
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      break;
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    products: filtered,
  });
}
