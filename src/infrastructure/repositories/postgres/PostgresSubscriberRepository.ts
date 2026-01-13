import { Subscriber } from '../../../core/domain/entities';
import { ISubscriberRepository } from '../../../core/domain/repositories';
import pool from '../../../lib/db';

export class PostgresSubscriberRepository implements ISubscriberRepository {
  private mapRowToSubscriber(row: any): Subscriber {
    return {
      id: row.id,
      email: row.email,
      createdAt: row.created_at,
    };
  }

  async create(data: any): Promise<Subscriber> {
    const { rows } = await pool.query(
      'INSERT INTO subscribers (email) VALUES ($1) RETURNING *',
      [data.email]
    );
    return this.mapRowToSubscriber(rows[0]);
  }

  async findAll(): Promise<Subscriber[]> {
    const { rows } = await pool.query('SELECT * FROM subscribers ORDER BY created_at DESC');
    return rows.map(this.mapRowToSubscriber);
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const { rows } = await pool.query('SELECT * FROM subscribers WHERE email = $1', [email]);
    if (rows.length === 0) return null;
    return this.mapRowToSubscriber(rows[0]);
  }
}
