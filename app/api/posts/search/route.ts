import { NextResponse } from 'next/server';
import { searchPosts } from '@/lib/wordpress';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
      return NextResponse.json({ error: 'Query is missing' }, { status: 400 });
  }

  try {
    const posts = await searchPosts(q);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search posts' }, { status: 500 });
  }
}
