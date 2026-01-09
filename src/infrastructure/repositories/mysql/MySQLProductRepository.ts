import { Product } from '../../../core/domain/entities';
import { IProductRepository } from '../../../core/domain/repositories';
import pool from './pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLProductRepository implements IProductRepository {
  private mapRowToProduct(row: any): Product {
    return {
      ...row,
      isFeatured: Boolean(row.isFeatured),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  async findByCategory(category: string): Promise<Product[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE category = ?', [category]);
    return rows.map(this.mapRowToProduct);
  }

  async findAll(): Promise<Product[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products ORDER BY createdAt DESC');
    return rows.map(this.mapRowToProduct);
  }

  async findById(id: string): Promise<Product | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return this.mapRowToProduct(rows[0]);
  }

  async findFeatured(): Promise<Product | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE isFeatured = 1 LIMIT 1');
    if (rows.length === 0) return null;
    return this.mapRowToProduct(rows[0]);
  }

  async create(data: any): Promise<Product> {
    const id = data.id || Math.random().toString(36).substring(7);
    const now = new Date();
    const productData = {
      id,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl || null,
      secondaryImageUrl: data.secondaryImageUrl || null,
      affiliateLink: data.affiliateLink,
      category: data.category,
      isFeatured: data.isFeatured ? 1 : 0,
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

    return { ...productData, isFeatured: Boolean(productData.isFeatured) } as Product;
  }

  async update(id: string, data: any): Promise<Product> {
    const now = new Date();
    const updateData = { ...data, updatedAt: now };
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured ? 1 : 0;
    }

    const keys = Object.keys(updateData);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id];

    await pool.query<ResultSetHeader>(
      `UPDATE products SET ${setClause} WHERE id = ?`,
      values
    );

    const updated = await this.findById(id);
    if (!updated) throw new Error('Product not found after update');
    return updated;
  }

  async setFeatured(id: string): Promise<Product> {
    // Unfeature all products first
    await pool.query('UPDATE products SET isFeatured = 0');
    // Set new featured product
    await pool.query('UPDATE products SET isFeatured = 1 WHERE id = ?', [id]);
    
    const featured = await this.findById(id);
    if (!featured) throw new Error('Product not found');
    return featured;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
