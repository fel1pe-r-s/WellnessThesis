import { Product } from '../../../core/domain/entities';
import { IProductRepository } from '../../../core/domain/repositories';
import pool from '../../../lib/db';

export class PostgresProductRepository implements IProductRepository {
  private mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      imageUrl: row.image_url,
      secondaryImageUrl: row.secondary_image_url, // Mapped from snake_case
      affiliateLink: row.affiliate_link,
      category: row.category,
      isFeatured: row.is_featured,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findByCategory(category: string): Promise<Product[]> {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC', 
      [category]
    );
    return rows.map(this.mapRowToProduct);
  }

  async findAll(): Promise<Product[]> {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return rows.map(this.mapRowToProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (rows.length === 0) return null;
    return this.mapRowToProduct(rows[0]);
  }

  async findFeatured(): Promise<Product | null> {
    const { rows } = await pool.query('SELECT * FROM products WHERE is_featured = true LIMIT 1');
    if (rows.length === 0) return null;
    return this.mapRowToProduct(rows[0]);
  }

  async create(data: any): Promise<Product> {
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, image_url, secondary_image_url, affiliate_link, category, is_featured) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        data.name,
        data.description,
        data.imageUrl || null,
        data.secondaryImageUrl || null,
        data.affiliateLink,
        data.category,
        data.isFeatured || false
      ]
    );
    return this.mapRowToProduct(rows[0]);
  }

  async update(id: string, data: any): Promise<Product> {
    // Dynamic update query builder for Postgres
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) { fields.push(`name = $${idx++}`); values.push(data.name); }
    if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
    if (data.imageUrl !== undefined) { fields.push(`image_url = $${idx++}`); values.push(data.imageUrl); }
    if (data.secondaryImageUrl !== undefined) { fields.push(`secondary_image_url = $${idx++}`); values.push(data.secondaryImageUrl); }
    if (data.affiliateLink !== undefined) { fields.push(`affiliate_link = $${idx++}`); values.push(data.affiliateLink); }
    if (data.category !== undefined) { fields.push(`category = $${idx++}`); values.push(data.category); }
    if (data.isFeatured !== undefined) { fields.push(`is_featured = $${idx++}`); values.push(data.isFeatured); }

    fields.push(`updated_at = NOW()`);

    if (fields.length === 1) { // Only updated_at
        return this.findById(id) as Promise<Product>;
    }

    values.push(id);
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    
    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) throw new Error('Product not found after update');
    return this.mapRowToProduct(rows[0]);
  }

  async setFeatured(id: string): Promise<Product> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('UPDATE products SET is_featured = false');
        const { rows } = await client.query('UPDATE products SET is_featured = true WHERE id = $1 RETURNING *', [id]);
        await client.query('COMMIT');
        
        if (rows.length === 0) throw new Error('Product not found');
        return this.mapRowToProduct(rows[0]);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return (rowCount || 0) > 0;
  }
}
