import { NextResponse } from 'next/server';
import { NewsletterSubscriberSchema } from '@/lib/schemas';
import { subscribeNewsletterUseCase } from '@/core/use-cases';
import { z } from 'zod';

/**
 * @swagger
 * /api/newsletter:
 *   post:
 *     summary: Subscribe to the newsletter
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Subscribed successfully
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = NewsletterSubscriberSchema.parse(body);

    const subscriber = await subscribeNewsletterUseCase.execute(email);

    return NextResponse.json({ message: 'Subscribed successfully', subscriber }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
