import { NextResponse } from 'next/server';
import { SubscriberSchema } from '@/lib/schemas';
import { query } from '@/lib/db';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, website } = body; // website is the honeypot

    // 1. Honeypot check: If 'website' field is filled, it's likely a bot.
    if (website) {
      console.warn('Newsletter Honeypot triggered');
      return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 }); // Stealth block
    }

    const validatedData = SubscriberSchema.parse({ email, name });

    // 2. IP Rate Limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    
    // Ensure rate limiting table exists
    try {
      await query('CREATE TABLE IF NOT EXISTS newsletter_rate_limits (ip TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    } catch (e) {
      console.error('Migration error (rate_limits):', e);
    }

    // Check recent attempts (last 10 minutes)
    const { rows: recentAttempts } = await query(
      'SELECT COUNT(*) as count FROM newsletter_rate_limits WHERE ip = $1 AND created_at > NOW() - INTERVAL \'10 minutes\'',
      [ip]
    );

    if (parseInt(recentAttempts[0].count) >= 5) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // Record attempt
    await query('INSERT INTO newsletter_rate_limits (ip) VALUES ($1)', [ip]);

    const id = crypto.randomUUID();
    const now = new Date();
    
    await query(
      'INSERT INTO subscribers (id, name, email, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      [id, validatedData.name || null, validatedData.email, now]
    );

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    console.error('API Error (POST newsletter):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
