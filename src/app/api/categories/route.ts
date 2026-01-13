import { NextResponse } from 'next/server';
import pool from '@/lib/db';


export async function GET() {
  try {
    const { rows } = await pool.query('SELECT DISTINCT category FROM posts WHERE published = true');
    const categories = rows.map((row: any) => row.category);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error (GET categories):', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
