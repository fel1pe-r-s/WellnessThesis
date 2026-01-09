import { Post, Product, Subscriber, User } from '../../../core/domain/entities';
import { IPostRepository, IProductRepository, ISubscriberRepository, IUserRepository } from '../../../core/domain/repositories';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async create(data: any): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substring(7),
      ...data,
    };
    this.users.push(user);
    return user;
  }
}

export class InMemoryPostRepository implements IPostRepository {
  private posts: Post[] = [];

  async findAll(): Promise<Post[]> {
    return this.posts;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return this.posts.find(p => p.slug === slug) || null;
  }

  async findByCategory(category: string): Promise<Post[]> {
    return this.posts.filter(p => p.category === category);
  }

  async findById(id: string): Promise<Post | null> {
    return this.posts.find(p => p.id === id) || null;
  }

  async create(data: any): Promise<Post> {
    const post: Post = {
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      updatedAt: new Date(),
      published: false,
      ...data,
    };
    this.posts.push(post);
    return post;
  }

  async update(id: string, data: any): Promise<Post> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');
    this.posts[index] = { ...this.posts[index], ...data, updatedAt: new Date() };
    return this.posts[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.posts.splice(index, 1);
    return true;
  }

  async findRelated(category: string, excludeId: string, limit: number): Promise<Post[]> {
    return this.posts
      .filter(p => p.category === category && p.id !== excludeId)
      .slice(0, limit);
  }

  async getCategories(): Promise<string[]> {
    const categories = this.posts.map(p => p.category);
    return Array.from(new Set(categories));
  }

  async search(query: string): Promise<Post[]> {
    const q = query.toLowerCase();
    return this.posts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.content.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  }
}

export class InMemoryProductRepository implements IProductRepository {
  private products: Product[] = [];

  async findByCategory(category: string): Promise<Product[]> {
    return this.products.filter(p => p.category === category);
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async findFeatured(): Promise<Product | null> {
    return this.products.find(p => p.isFeatured) || null;
  }

  async create(data: any): Promise<Product> {
    const product: Product = {
      id: Math.random().toString(36).substring(7),
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: '',
      ...data,
    };
    this.products.push(product);
    return product;
  }

  async update(id: string, data: any): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.products[index] = { ...this.products[index], ...data, updatedAt: new Date() };
    return this.products[index];
  }

  async setFeatured(id: string): Promise<Product> {
    this.products = this.products.map(p => ({ ...p, isFeatured: p.id === id }));
    const featured = this.products.find(p => p.id === id);
    if (!featured) throw new Error('Product not found');
    return featured;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
}

export class InMemorySubscriberRepository implements ISubscriberRepository {
  private subscribers: Subscriber[] = [];

  async create(email: string): Promise<Subscriber> {
    const subscriber: Subscriber = {
      id: Math.random().toString(36).substring(7),
      email,
      createdAt: new Date(),
    };
    this.subscribers.push(subscriber);
    return subscriber;
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    return this.subscribers.find(s => s.email === email) || null;
  }
}
