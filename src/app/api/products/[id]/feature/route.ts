import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/core/domain/provider';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.valid || authResult.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Set the selected product as featured (repository handles unfeaturing others)
    const product = await repositories.productRepository.setFeatured(id);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating featured product:', error);
    return NextResponse.json(
      { error: 'Failed to update featured product' },
      { status: 500 }
    );
  }
}
