import { NextResponse } from 'next/server';
import { repositories } from '@/core/domain/provider';

export async function GET() {
  try {
    const featuredProduct = await repositories.productRepository.findFeatured();

    if (!featuredProduct) {
      return NextResponse.json(
        { error: 'No featured product found' },
        { status: 404 }
      );
    }

    return NextResponse.json(featuredProduct);
  } catch (error) {
    console.error('Error fetching featured product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured product' },
      { status: 500 }
    );
  }
}
