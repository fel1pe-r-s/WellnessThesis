import { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  if (!token) {
    return { valid: false, user: null };
  }

  const decoded = await verifyJwt(token);

  if (!decoded) {
    return { valid: false, user: null };
  }

  return {
    valid: true,
    user: decoded as { id: string; email: string; role: string },
  };
}
