import 'dotenv/config'; // Load env vars before other imports
import pool from '../lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const AdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
});

async function initDb() {
  console.log('Initializing Database (PostgreSQL)...');

  try {
    const client = await pool.connect();
    
    try {
      // 1. Users Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255),
          name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Users table ready');

      // 2. Products Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          image_url TEXT,
          secondary_image_url TEXT,
          affiliate_link TEXT NOT NULL,
          category VARCHAR(100),
          is_featured BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Products table ready');

      // 3. Posts Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          content TEXT NOT NULL,
          image_url TEXT,
          category VARCHAR(100) NOT NULL,
          published BOOLEAN DEFAULT FALSE,
          author_id UUID REFERENCES users(id) ON DELETE SET NULL,
          cta_link TEXT,
          product_id UUID REFERENCES products(id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Posts table ready');

      // 4. Subscribers Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Subscribers table ready');

      // --- Seed Admin User ---
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      const adminName = process.env.ADMIN_NAME;

      if (!adminEmail || !adminPassword || !adminName) {
        console.warn('⚠️ ADMIN_EMAIL, ADMIN_PASSWORD, or ADMIN_NAME not set in .env. Skipping admin creation.');
      } else {
        const validation = AdminSchema.safeParse({
          email: adminEmail,
          password: adminPassword,
          name: adminName
        });

        if (!validation.success) {
           console.error('❌ Admin credentials validation failed:', validation.error.format());
        } else {
             // Check if admin exists
            const { rows: existingAdmins } = await client.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
            
            if (existingAdmins.length === 0) {
              const hashedPassword = await bcrypt.hash(adminPassword, 10);
              await client.query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
                [adminEmail, hashedPassword, adminName, 'admin']
              );
              console.log(`✅ Admin user created: ${adminEmail}`);
            } else {
              console.log('ℹ️ Admin user already exists.');
            }
        }
      }

    } finally {
      client.release();
    }

    console.log('✅ Database initialization completed successfully.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDb();
