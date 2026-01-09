import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT DISTINCT category FROM posts WHERE published = 1');
    const categories = rows.map(row => row.category);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error (GET categories):', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
