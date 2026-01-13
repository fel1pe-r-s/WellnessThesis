import { User } from '../../../core/domain/entities';
import { IUserRepository } from '../../../core/domain/repositories';
import pool from '../../../lib/db';

export class PostgresUserRepository implements IUserRepository {
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      role: row.role,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return null;
    return this.mapRowToUser(rows[0]);
  }

  async create(user: User): Promise<User> {
    // If id is not provided, let Postgres generate it. If it IS provided, insert it.
    // Usually user.id is undefined here unless pre-generated.
    // We'll let Postgres generate if undefined.
    
    // Note: The entity interface says 'id' is string. 
    // If we want to return the generated UUID, we need RETURNING.
    
    const { rows } = await pool.query(
      `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, created_at, updated_at`,
      [user.email, user.password, user.name, user.role]
    );

    const newUser = rows[0];
    return {
      ...user,
      id: newUser.id
    };
  }
}
