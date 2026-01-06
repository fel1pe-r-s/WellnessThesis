import { describe, it, expect, beforeEach } from 'vitest';
import { CreateProductUseCase } from '../ProductUseCases';
import { Product } from '../../domain/entities';

// In-Memory Repository for testing as requested by user rules
class InMemoryProductRepository {
  products: Product[] = [];
  async create(data: any): Promise<Product> {
    const product = { ...data, id: Math.random().toString(), createdAt: new Date() } as Product;
    this.products.push(product);
    return product;
  }
  async findAll(): Promise<Product[]> { return this.products; }
  async findById(id: string): Promise<Product | null> { return this.products.find(p => p.id === id) || null; }
  async update(id: string, data: any): Promise<Product> {
    const idx = this.products.findIndex(p => p.id === id);
    this.products[idx] = { ...this.products[idx], ...data };
    return this.products[idx];
  }
  async delete(id: string): Promise<void> {
    this.products = this.products.filter(p => p.id !== id);
  }
}

describe('ProductUseCases', () => {
  let repository: InMemoryProductRepository;
  let createProduct: CreateProductUseCase;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    createProduct = new CreateProductUseCase(repository as any);
  });

  it('should create a new product', async () => {
    const productData = {
      name: 'Test Product',
      imageUrl: 'http://test.com/img.png',
      affiliateLink: 'http://aff.com/123',
      category: 'Health'
    };

    const product = await createProduct.execute(productData);

    expect(product.name).toBe('Test Product');
    expect(repository.products.length).toBe(1);
  });
});
