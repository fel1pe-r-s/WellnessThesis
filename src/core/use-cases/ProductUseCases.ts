import { IProductRepository } from '../domain/repositories';
import { Product } from '../domain/entities';

export class GetAllProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}

export class GetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
}

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: any): Promise<Product> {
    return this.productRepository.create(data);
  }
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, data: any): Promise<Product> {
    return this.productRepository.update(id, data);
  }
}

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}

export class GetProductsByCategoryUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }
}
