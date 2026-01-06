import { Post, Product, Subscriber } from './entities';

export interface IPostRepository {
  findAll(): Promise<Post[]>;
  findBySlug(slug: string): Promise<Post | null>;
  findByCategory(category: string): Promise<Post[]>;
  findById(id: string): Promise<Post | null>;
  create(data: any): Promise<Post>;
  update(id: string, data: any): Promise<Post>;
  delete(id: string): Promise<boolean>;
}

export interface IProductRepository {
  findByCategory(category: string): Promise<Product[]>;
  findAll(): Promise<Product[]>;
}

export interface ISubscriberRepository {
  create(email: string): Promise<Subscriber>;
  findByEmail(email: string): Promise<Subscriber | null>;
}
