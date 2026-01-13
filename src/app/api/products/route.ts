import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ProductSchema } from '@/lib/schemas';

import { verifyJwt } from '@/lib/jwt';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    const products = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      imageUrl: row.image_url,
      secondaryImageUrl: row.secondary_image_url,
      affiliateLink: row.affiliate_link,
      category: row.category,
      isFeatured: Boolean(row.is_featured),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
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

    const now = new Date();
    
    // Use explicit column list mapping
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, image_url, secondary_image_url, affiliate_link, category, is_featured, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        validatedData.name,
        validatedData.description,
        validatedData.imageUrl || null,
        validatedData.secondaryImageUrl || null,
        validatedData.affiliateLink,
        validatedData.category,
        validatedData.isFeatured || false,
        now
      ]
    );

    const row = rows[0];
    const newProduct = {
      id: row.id,
      name: row.name,
      description: row.description,
      imageUrl: row.image_url,
      secondaryImageUrl: row.secondary_image_url,
      affiliateLink: row.affiliate_link,
      category: row.category,
      isFeatured: Boolean(row.is_featured),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('API Error (POST product):', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
