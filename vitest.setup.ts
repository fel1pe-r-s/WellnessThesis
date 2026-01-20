import { vi } from 'vitest';

vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => vi.fn().mockResolvedValue([])),
}));

process.env.DATABASE_URL = 'postgres://localhost:5432/test';
