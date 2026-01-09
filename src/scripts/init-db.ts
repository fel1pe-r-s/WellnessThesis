import pool from '../infrastructure/repositories/mysql/pool';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function initDb() {
  console.log('Initializing MySQL Database...');

  try {
    // 1. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user'
      )
    `);

    // 2. Products Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        imageUrl TEXT,
        secondaryImageUrl TEXT,
        affiliateLink TEXT NOT NULL,
        category VARCHAR(100),
        isFeatured TINYINT(1) DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 3. Posts Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT,
        imageUrl TEXT,
        category VARCHAR(100),
        published TINYINT(1) DEFAULT 0,
        authorId VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        ctaLink TEXT,
        productId VARCHAR(50),
        FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL
      )
    `);

    // 4. Subscribers Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Default Admin User
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (adminEmail && adminPassword) {
      const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [adminEmail]);
      
      if (rows.length === 0) {
        console.log(`Creating default admin user: ${adminEmail}`);
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const id = Math.random().toString(36).substring(7);
        
        await pool.query(
          'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
          [id, adminEmail, hashedPassword, adminName, 'admin']
        );
        console.log('Admin user created successfully!');
      } else {
        console.log('Admin user already exists.');
      }
    }

    console.log('Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb();
