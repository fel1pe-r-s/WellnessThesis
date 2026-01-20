import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { query } from '@/lib/db';
import { PostSchema } from '@/lib/schemas';


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { rows } = await query('SELECT * FROM posts WHERE id = $1', [id]);
    
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
      isFeatured: Boolean(row.is_featured),
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
    
    const { rowCount } = await query(
      `UPDATE posts SET title = $1, slug = $2, content = $3, image_url = $4, category = $5, published = $6, is_featured = $7, author_id = $8, cta_link = $9, product_id = $10, updated_at = $11 WHERE id = $12 RETURNING id`,
      [
        validatedData.title,
        validatedData.slug,
        validatedData.content,
        validatedData.imageUrl,
        validatedData.category,
        validatedData.published,
        validatedData.isFeatured,
        validatedData.authorId,
        validatedData.ctaLink,
        validatedData.productId,
        now,
        id
      ]
    );
    
    

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Return the updated fields (or at least ID and slug) so frontend can use them
    return NextResponse.json({ success: true, id, slug: validatedData.slug });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('API Error (PUT post):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Alias PATCH to PUT for convenience as frontend uses PATCH
export { PUT as PATCH };

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
    const { rowCount } = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
    
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error (DELETE post):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
