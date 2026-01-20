import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJwt } from '@/lib/jwt';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }>}
) {
  try {
    const token = request.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token || !verifyJwt(token)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // 1. Unset all other featured products (optional, if we only allow ONE featured product)
    // For now, let's assume we toggle the specific one requested. 
    // Wait, "setFeatured" usually implies "Make this the ONE".
    // If the user wants to toggle, the frontend sends PATCH.
    // Let's look at frontend: "handleToggleFeatured".
    
    // Actually, looking at the frontend, it just hits this endpoint.
    // If the behavior is "Toggle" on the frontend:
    // But the route is named ".../feature", implying "Make Featured".
    // Let's implement logic to TOGGLE the current state of THIS product.
    
    const { rows: current } = await query('SELECT is_featured FROM products WHERE id = $1', [id]);
    if (current.length === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    
    const newState = !current[0].is_featured;
    
    await query('UPDATE products SET is_featured = $1, updated_at = NOW() WHERE id = $2', [newState, id]);

    return NextResponse.json({ success: true, isFeatured: newState });
  } catch (error) {
    console.error('Error updating featured product:', error);
    return NextResponse.json(
      { error: 'Failed to update featured product' },
      { status: 500 }
    );
  }
}
