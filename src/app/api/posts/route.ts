import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { rows } = await query(
      'SELECT * FROM posts WHERE published = true ORDER BY is_featured DESC, created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const posts = rows.map((row: any) => ({
      ...row,
      imageUrl: row.image_url,
      authorId: row.author_id,
      productId: row.product_id,
      isFeatured: row.is_featured,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error('API Posts Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
