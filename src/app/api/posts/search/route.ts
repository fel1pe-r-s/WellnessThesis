import { NextResponse } from 'next/server';
import { searchPostsUseCase } from '@/core/use-cases';

export async function GET(request: Request) {
  const { searchParams  } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const posts = await searchPostsUseCase.execute(query);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
