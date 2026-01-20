import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    const searchQuery = `%${q.toLowerCase()}%`;
    const { rows } = await query(
      `SELECT id, title, slug, image_url as "imageUrl", category 
       FROM posts 
       WHERE (LOWER(title) LIKE $1 OR LOWER(content) LIKE $1 OR LOWER(category) LIKE $1)
       AND published = true
       LIMIT 10`,
      [searchQuery]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
