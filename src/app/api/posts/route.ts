import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import pool from '@/lib/db';
import { PostSchema } from '@/lib/schemas';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM posts ORDER BY createdAt DESC');
    const posts = rows.map(row => ({
      ...row,
      published: Boolean(row.published),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
    return NextResponse.json(posts);
  } catch (error) {
    console.error('API Error (GET posts):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = PostSchema.parse(body);

    const id = validatedData.id || Math.random().toString(36).substring(7);
    const now = new Date();
    
    const postData = {
      ...validatedData,
      id,
      published: validatedData.published ? 1 : 0,
      createdAt: now,
      updatedAt: now,
    };

    const keys = Object.keys(postData);
    const values = Object.values(postData);
    const placeholders = keys.map(() => '?').join(', ');

    await pool.query<ResultSetHeader>(
      `INSERT INTO posts (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );

    return NextResponse.json({ ...postData, published: Boolean(postData.published) }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('API Error (POST post):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
