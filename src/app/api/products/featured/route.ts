import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const featuredProduct = await prisma.product.findFirst({
      where: {
        isFeatured: true,
      },
    });

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
