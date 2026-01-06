import { NextResponse } from 'next/server';
import { createProductUseCase, getAllProductsUseCase } from '@/core/use-cases';

export async function GET() {
  try {
    const products = await getAllProductsUseCase.execute();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const product = await createProductUseCase.execute(data);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
