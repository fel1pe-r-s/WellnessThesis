import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// O neon() retorna uma função que pode ser usada diretamente
const sql = neon(process.env.DATABASE_URL);

console.log('🔌 DB Connection: Neon Serverless (HTTP Driver)');

// Helper wrapper para manter compatibilidade com a sintaxe anterior (pool.query)
// Agora usando a chamada direta da função neon que é compatível com hosting sem suporte a Pool
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = async (text: string, params?: any[]): Promise<{ rows: any[]; rowCount: number }> => {
  // Para chamadas com parâmetros, o Neon agora exige o uso de sql.query ou tagged templates
  const rows = await (sql as any).query(text, params || []);
  return { 
    rows: rows as any[], 
    rowCount: (rows as any[]).length 
  };
};

export default sql;

