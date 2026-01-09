import { User } from '../../../core/domain/entities';
import { IUserRepository } from '../../../core/domain/repositories';
import pool from './pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MySQLUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) return null;
    return rows[0] as User;
  }

  async create(data: Partial<User>): Promise<User> {
    const { email, password, name, role } = data;
    const id = data.id || Math.random().toString(36).substring(7);
    
    await pool.query<ResultSetHeader>(
      'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
      [id, email, password, name, role || 'user']
    );

    return { id, email, password, name, role: role || 'user' } as User;
  }
}
