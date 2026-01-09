import { NextResponse } from 'next/server';
import { SubscriberSchema } from '@/lib/schemas';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = SubscriberSchema.parse(body);

    const id = Math.random().toString(36).substring(7);
    const now = new Date();
    
    await pool.query<ResultSetHeader>(
      'INSERT INTO subscribers (id, email, createdAt) VALUES (?, ?, ?)',
      [id, email, now]
    );

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    console.error('API Error (POST newsletter):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
