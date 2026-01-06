import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.valid || authResult.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // First, unfeatured all products
    await prisma.product.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false },
    });

    // Then, set the selected product as featured
    const product = await prisma.product.update({
      where: { id },
      data: { isFeatured: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating featured product:', error);
    return NextResponse.json(
      { error: 'Failed to update featured product' },
      { status: 500 }
    );
  }
}
