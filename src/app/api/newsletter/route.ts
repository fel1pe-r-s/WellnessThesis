import { NextResponse } from 'next/server';
import { SubscriberSchema } from '@/lib/schemas';
import { query } from '@/lib/db';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = SubscriberSchema.parse(body);

    const id = Math.random().toString(36).substring(7);
    const now = new Date();
    
    // Postgres doesn't ignore duplicate keys by default without ON CONFLICT, 
    // but the original code didn't handle unique constraint error explicitly or relied on try/catch.
    // The Schema check is simple email.
    // Using ON CONFLICT DO NOTHING to match "subscribe successfully" even if already there, or return error.
    // Original code was just INSERT. If unique index on email, it throws.
    
    await query(
      'INSERT INTO subscribers (id, email, created_at) VALUES ($1, $2, $3)',
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
