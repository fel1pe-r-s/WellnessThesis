import { Subscriber } from '../../../core/domain/entities';
import { ISubscriberRepository } from '../../../core/domain/repositories';
import pool from './pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLSubscriberRepository implements ISubscriberRepository {
  async create(email: string): Promise<Subscriber> {
    const id = Math.random().toString(36).substring(7);
    const now = new Date();
    
    await pool.query<ResultSetHeader>(
      'INSERT INTO subscribers (id, email, createdAt) VALUES (?, ?, ?)',
      [id, email, now]
    );

    return { id, email, createdAt: now };
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM subscribers WHERE email = ?',
      [email]
    );
    if (rows.length === 0) return null;
    return {
      ...rows[0],
      createdAt: new Date(rows[0].createdAt)
    } as Subscriber;
  }
}
