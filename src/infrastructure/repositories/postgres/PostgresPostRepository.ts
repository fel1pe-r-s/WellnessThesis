import { Post } from '../../../core/domain/entities';
import { IPostRepository } from '../../../core/domain/repositories';
import pool from '../../../lib/db';

export class PostgresPostRepository implements IPostRepository {
  private mapRowToPost(row: any): Post {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      imageUrl: row.image_url,
      category: row.category,
      published: row.published,
      authorId: row.author_id,
      ctaLink: row.cta_link,
      productId: row.product_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      product: row.product_id ? {
        id: row.product_id,
        name: row.product_name,
        description: row.product_description,
        imageUrl: row.product_image_url,
        secondaryImageUrl: row.product_secondary_image_url,
        affiliateLink: row.product_affiliate_link,
        category: row.product_category, // Assuming product category is same or needed
        isFeatured: row.product_is_featured,
        createdAt: row.product_created_at || new Date(), // These might be missing in join if not selected carefully
        updatedAt: row.product_updated_at || new Date(),
      } : undefined
    };
  }

  async findAll(): Promise<Post[]> {
    const query = `
      SELECT 
        p.*,
        pr.name as product_name,
        pr.description as product_description,
        pr.image_url as product_image_url,
        pr.secondary_image_url as product_secondary_image_url,
        pr.affiliate_link as product_affiliate_link,
        pr.category as product_category,
        pr.is_featured as product_is_featured,
        pr.created_at as product_created_at,
        pr.updated_at as product_updated_at
      FROM posts p
      LEFT JOIN products pr ON p.product_id = pr.id
      ORDER BY p.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows.map(this.mapRowToPost);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const query = `
      SELECT 
        p.*,
        pr.name as product_name,
        pr.description as product_description,
        pr.image_url as product_image_url,
        pr.secondary_image_url as product_secondary_image_url,
        pr.affiliate_link as product_affiliate_link,
        pr.category as product_category,
        pr.is_featured as product_is_featured,
        pr.created_at as product_created_at,
        pr.updated_at as product_updated_at
      FROM posts p
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE p.slug = $1
    `;
    const { rows } = await pool.query(query, [slug]);
    if (rows.length === 0) return null;
    return this.mapRowToPost(rows[0]);
  }

  async findByCategory(category: string): Promise<Post[]> {
    const query = `
      SELECT 
        p.*,
        pr.name as product_name,
        pr.description as product_description,
        pr.image_url as product_image_url,
        pr.secondary_image_url as product_secondary_image_url,
        pr.affiliate_link as product_affiliate_link,
        pr.category as product_category,
        pr.is_featured as product_is_featured,
        pr.created_at as product_created_at,
        pr.updated_at as product_updated_at
      FROM posts p
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE p.category = $1
      ORDER BY p.created_at DESC
    `;
    const { rows } = await pool.query(query, [category]);
    return rows.map(this.mapRowToPost);
  }

  async create(data: any): Promise<Post> {
    const { rows } = await pool.query(
      `INSERT INTO posts (title, slug, content, image_url, category, published, author_id, cta_link, product_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        data.title,
        data.slug,
        data.content,
        data.imageUrl || null,
        data.category,
        data.published || false,
        data.authorId || null,
        data.ctaLink || null,
        data.productId || null
      ]
    );
    return this.mapRowToPost(rows[0]);
  }

  async update(id: string, data: any): Promise<Post> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.slug !== undefined) { fields.push(`slug = $${idx++}`); values.push(data.slug); }
    if (data.content !== undefined) { fields.push(`content = $${idx++}`); values.push(data.content); }
    if (data.imageUrl !== undefined) { fields.push(`image_url = $${idx++}`); values.push(data.imageUrl); }
    if (data.category !== undefined) { fields.push(`category = $${idx++}`); values.push(data.category); }
    if (data.published !== undefined) { fields.push(`published = $${idx++}`); values.push(data.published); }
    if (data.authorId !== undefined) { fields.push(`author_id = $${idx++}`); values.push(data.authorId); }
    if (data.ctaLink !== undefined) { fields.push(`cta_link = $${idx++}`); values.push(data.ctaLink); }
    if (data.productId !== undefined) { fields.push(`product_id = $${idx++}`); values.push(data.productId); }

    fields.push(`updated_at = NOW()`);

    if (fields.length === 1) {
        return this.findById(id) as Promise<Post>; // Or handle efficiently
    }

    values.push(id);
    const query = `UPDATE posts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    
    // Note: FindById performs the join, checking strictly this update might not return joined product immediately
    // unless we rejoin. For simplicity, we return the updated entity (without deep product if not queried).
    // But mapRowToPost handles product_id.
    
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) throw new Error('Post not found after update');
    
    // Return full object with joins
    const updated = await this.findById(id);
    if (!updated) throw new Error('Post not found after update refetch');
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    return (rowCount || 0) > 0;
  }

  // Helper for admin to get by ID
  async findById(id: string): Promise<Post | null> {
    const query = `
      SELECT 
        p.*,
        pr.name as product_name,
        pr.description as product_description,
        pr.image_url as product_image_url,
        pr.secondary_image_url as product_secondary_image_url,
        pr.affiliate_link as product_affiliate_link,
        pr.category as product_category,
        pr.is_featured as product_is_featured,
        pr.created_at as product_created_at,
        pr.updated_at as product_updated_at
      FROM posts p
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE p.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    return this.mapRowToPost(rows[0]);
  }

  async findRelated(slug: string): Promise<Post[]> {
    const current = await this.findBySlug(slug);
    if (!current) return [];
    
    // Find posts in same category, exclude current
    const query = `
      SELECT * FROM posts 
      WHERE category = $1 AND slug != $2 AND published = true
      ORDER BY created_at DESC
      LIMIT 3
    `;
    const { rows } = await pool.query(query, [current.category, slug]);
    return rows.map(this.mapRowToPost);
  }

  async getCategories(): Promise<string[]> {
    const { rows } = await pool.query('SELECT DISTINCT category FROM posts WHERE published = true');
    return rows.map((r: any) => r.category);
  }

  async search(term: string): Promise<Post[]> {
    const query = `
      SELECT * FROM posts 
      WHERE (title ILIKE $1 OR content ILIKE $1) AND published = true
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [`%${term}%`]);
    return rows.map(this.mapRowToPost);
  }
}
