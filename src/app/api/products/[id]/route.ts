import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { query } from '@/lib/db';
import { ProductSchema } from '@/lib/schemas';


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { rows } = await query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const row = rows[0];
    const product = {
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
    
    const columnMapping: Record<string, string> = {
      name: 'name',
      description: 'description',
      imageUrl: 'image_url',
      secondaryImageUrl: 'secondary_image_url',
      affiliateLink: 'affiliate_link',
      category: 'category',
      isFeatured: 'is_featured',
      updatedAt: 'updated_at' 
    };

    const updateValues: any[] = [];
    const setClauses: string[] = [];
    
    Object.entries(validatedData).forEach(([key, value]) => {
      const colName = columnMapping[key];
      if (colName && value !== undefined) {
          setClauses.push(`${colName} = $${setClauses.length + 1}`);
          updateValues.push(value);
      }
    });

    // Always update updatedAt
    setClauses.push(`updated_at = $${setClauses.length + 1}`);
    updateValues.push(now);

    // Add ID for WHERE clause
    updateValues.push(id);
    
    const queryText = `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${updateValues.length} RETURNING id`;

    const { rowCount } = await query(queryText, updateValues);

    if (rowCount === 0) {
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
    const { rowCount } = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error (DELETE product):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
