import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// O neon() retorna uma função que pode ser usada diretamente
const sql = neon(process.env.DATABASE_URL);

export const query = async (text: string, params?: any[]): Promise<{ rows: any[]; rowCount: number }> => {
  const rows = await (sql as any).query(text, params || []);
  return { 
    rows: rows as any[], 
    rowCount: (rows as any[]).length 
  };
};


const pool = { query };
export default pool;


