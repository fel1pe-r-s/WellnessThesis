import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import pool from '@/lib/db';
import { PostSchema } from '@/lib/schemas';


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const row = rows[0];
    const post = {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      imageUrl: row.image_url,
      category: row.category,
      published: Boolean(row.published),
      authorId: row.author_id,
      ctaLink: row.cta_link,
      productId: row.product_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('API Error (GET post by id):', error);
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
    
    // Validate with partial schema as updates might not include all fields
    const validatedData = PostSchema.partial().parse(body);
    const now = new Date();
    
    // Map camelCase to snake_case for DB
    const dbData: any = {};
    if (validatedData.title !== undefined) dbData.title = validatedData.title;
    if (validatedData.slug !== undefined) dbData.slug = validatedData.slug;
    if (validatedData.content !== undefined) dbData.content = validatedData.content;
    if (validatedData.imageUrl !== undefined) dbData.image_url = validatedData.imageUrl;
    if (validatedData.category !== undefined) dbData.category = validatedData.category;
    if (validatedData.published !== undefined) dbData.published = validatedData.published;
    if (validatedData.authorId !== undefined) dbData.author_id = validatedData.authorId;
    if (validatedData.ctaLink !== undefined) dbData.cta_link = validatedData.ctaLink;
    if (validatedData.productId !== undefined) dbData.product_id = validatedData.productId;

    dbData.updated_at = now;

    const keys = Object.keys(dbData);
    const values = Object.values(dbData);
    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
    
    // Add ID as the last parameter
    values.push(id);
    const idParamIndex = values.length;

    const { rowCount } = await pool.query(
      `UPDATE posts SET ${setClause} WHERE id = $${idParamIndex}`,
      values
    );

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('API Error (PUT post):', error);
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
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error (DELETE post):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
