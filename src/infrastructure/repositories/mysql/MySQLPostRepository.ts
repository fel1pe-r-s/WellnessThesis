import { Post } from '../../../core/domain/entities';
import { IPostRepository } from '../../../core/domain/repositories';
import pool from './pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLPostRepository implements IPostRepository {
  private mapRowToPost(row: any): Post {
    return {
      ...row,
      published: Boolean(row.published),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  async findAll(): Promise<Post[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM posts ORDER BY createdAt DESC');
    return rows.map(this.mapRowToPost);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM posts WHERE slug = ?', [slug]);
    if (rows.length === 0) return null;
    return this.mapRowToPost(rows[0]);
  }

  async findByCategory(category: string): Promise<Post[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM posts WHERE category = ? ORDER BY createdAt DESC', [category]);
    return rows.map(this.mapRowToPost);
  }

  async findById(id: string): Promise<Post | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return this.mapRowToPost(rows[0]);
  }

  async create(data: any): Promise<Post> {
    const id = data.id || Math.random().toString(36).substring(7);
    const now = new Date();
    const postData = {
      id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      imageUrl: data.imageUrl || null,
      category: data.category,
      published: data.published ? 1 : 0,
      authorId: data.authorId || null,
      createdAt: now,
      updatedAt: now,
      ctaLink: data.ctaLink || null,
      productId: data.productId || null,
    };

    const keys = Object.keys(postData);
    const values = Object.values(postData);
    const placeholders = keys.map(() => '?').join(', ');

    await pool.query<ResultSetHeader>(
      `INSERT INTO posts (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );

    return { ...postData, published: Boolean(postData.published) } as Post;
  }

  async update(id: string, data: any): Promise<Post> {
    const now = new Date();
    const updateData = { ...data, updatedAt: now };
    if (updateData.published !== undefined) {
      updateData.published = updateData.published ? 1 : 0;
    }

    const keys = Object.keys(updateData);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id];

    await pool.query<ResultSetHeader>(
      `UPDATE posts SET ${setClause} WHERE id = ?`,
      values
    );

    const updated = await this.findById(id);
    if (!updated) throw new Error('Post not found after update');
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM posts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  async findRelated(category: string, excludeId: string, limit: number): Promise<Post[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM posts WHERE category = ? AND id != ? LIMIT ?',
      [category, excludeId, limit]
    );
    return rows.map(this.mapRowToPost);
  }

  async getCategories(): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT DISTINCT category FROM posts');
    return rows.map(row => row.category);
  }

  async search(query: string): Promise<Post[]> {
    const q = `%${query}%`;
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? OR category LIKE ?',
      [q, q, q]
    );
    return rows.map(this.mapRowToPost);
  }
}
