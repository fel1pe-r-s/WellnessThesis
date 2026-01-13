import { Pool } from '@neondatabase/serverless';

const isLocal = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : true, // Neon serverless driver handles SSL automatically, but 'true' explicitly forces it for remote
});

console.log(`🔌 DB Connection: ${isLocal ? 'Localhost' : 'Remote/Neon (Serverless Driver)'}`);

export default pool;
