import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import pool from '@/lib/db';
import { ProductSchema } from '@/lib/schemas';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = {
      ...rows[0],
      isFeatured: Boolean(rows[0].isFeatured),
      createdAt: new Date(rows[0].createdAt),
      updatedAt: new Date(rows[0].updatedAt),
    };

    return NextResponse.json(product);
  } catch (error) {
    console.error('API Error (GET product by id):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const validatedData = ProductSchema.partial().parse(body);
    const now = new Date();
    
    const updateData: any = { ...validatedData, updatedAt: now };
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured ? 1 : 0;
    }

    const keys = Object.keys(updateData);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id];

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE products SET ${setClause} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('API Error (PUT product):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error (DELETE product):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
