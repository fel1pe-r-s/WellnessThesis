import { Post, Product, Subscriber, User } from './entities';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: any): Promise<User>;
}

export interface IPostRepository {
  findAll(): Promise<Post[]>;
  findBySlug(slug: string): Promise<Post | null>;
  findByCategory(category: string): Promise<Post[]>;
  findById(id: string): Promise<Post | null>;
  create(data: any): Promise<Post>;
  update(id: string, data: any): Promise<Post>;
  delete(id: string): Promise<boolean>;
  findRelated(category: string, excludeId: string, limit: number): Promise<Post[]>;
  getCategories(): Promise<string[]>; // NEW: Added to fetch unique categories
  search(query: string): Promise<Post[]>; // NEW: Added for search functionality
}

export interface IProductRepository {
  findByCategory(category: string): Promise<Product[]>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findFeatured(): Promise<Product | null>; // NEW: Added for spotlight
  create(data: any): Promise<Product>;
  update(id: string, data: any): Promise<Product>;
  setFeatured(id: string): Promise<Product>; // NEW: Added for setting spotlight
  delete(id: string): Promise<boolean>;
}

export interface ISubscriberRepository {
  create(email: string): Promise<Subscriber>;
  findByEmail(email: string): Promise<Subscriber | null>;
}
