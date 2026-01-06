import { IProductRepository } from '../domain/repositories';
import { Product } from '../domain/entities';

export class GetProductsByCategoryUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }
}

export class GetAllProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
