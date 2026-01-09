import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ProductSchema } from '@/lib/schemas';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { verifyJwt } from '@/lib/jwt';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products ORDER BY createdAt DESC');
    const products = rows.map(row => ({
      ...row,
      isFeatured: Boolean(row.isFeatured),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error (GET products):', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = ProductSchema.parse(body);

    const id = validatedData.id || Math.random().toString(36).substring(7);
    const now = new Date();
    
    const productData = {
      ...validatedData,
      id,
      isFeatured: validatedData.isFeatured ? 1 : 0,
      createdAt: now,
      updatedAt: now,
    };

    const keys = Object.keys(productData);
    const values = Object.values(productData);
    const placeholders = keys.map(() => '?').join(', ');

    await pool.query<ResultSetHeader>(
      `INSERT INTO products (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );

    return NextResponse.json({ ...productData, isFeatured: Boolean(productData.isFeatured) }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('API Error (POST product):', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
