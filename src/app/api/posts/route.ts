import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import pool from '@/lib/db';
import { PostSchema } from '@/lib/schemas';


export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    const posts = rows.map((row: any) => ({
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
    }));
    return NextResponse.json(posts);
  } catch (error) {
    console.error('API Error (GET posts):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = PostSchema.parse(body);

    // Postgres generates UUIDs usually, but we might want to supply it if schema allows.
    // Init script set default gen_random_uuid().
    // If we don't supply ID, it is generated.
    // If validatedData has ID, use it. If not, don't include in INSERT (let default work)
    // Or simpler: Let DB generate it unless strictly required.
    // However, the original code generated ID manually.
    // Let's rely on DB generation for ID if not provided.
    
    const now = new Date();
    
    const { rows } = await pool.query(
      `INSERT INTO posts (title, slug, content, image_url, category, published, author_id, cta_link, product_id, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        validatedData.title,
        validatedData.slug,
        validatedData.content,
        validatedData.imageUrl || null,
        validatedData.category,
        validatedData.published || false,
        validatedData.authorId || null,
        validatedData.ctaLink || null,
        validatedData.productId || null,
        now
      ]
    );

    const row = rows[0];
    const newPost = {
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

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    console.error('API Error (POST post):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
