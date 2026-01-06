import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { getPostsUseCase, createPostUseCase } from '@/core/use-cases';

export async function GET() {
  const posts = await getPostsUseCase.execute();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const token = request.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  try {
    const post = await createPostUseCase.execute(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
