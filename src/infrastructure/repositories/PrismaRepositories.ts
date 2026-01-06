import { PrismaClient } from '@prisma/client';
import { IPostRepository, IProductRepository, ISubscriberRepository } from '../../core/domain/repositories';
import { Post, Product, Subscriber } from '../../core/domain/entities';
import prisma from '@/lib/prisma';

export class PrismaPostRepository implements IPostRepository {
  async findAll(): Promise<Post[]> {
    return prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    }) as unknown as Post[];
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { slug },
      include: { product: true },
    }) as unknown as Post | null;
  }

  async findByCategory(category: string): Promise<Post[]> {
    return prisma.post.findMany({
      where: { category: { equals: category, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    }) as unknown as Post[];
  }

  async findById(id: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: { product: true },
    }) as unknown as Post | null;
  }

  async create(data: any): Promise<Post> {
    return prisma.post.create({
      data: {
        ...data,
        author: { connect: { id: data.authorId } }
      },
    }) as unknown as Post;
  }

  async update(id: string, data: any): Promise<Post> {
      // Remove authorId from update data if nested connect isn't needed or handle it
      const { authorId, ...updateData } = data;
      return prisma.post.update({
          where: { id },
          data: updateData,
      }) as unknown as Post;
  }

  async delete(id: string): Promise<boolean> {
      await prisma.post.delete({
          where: { id },
      });
      return true;
  }

  async findRelated(category: string, excludeId: string, limit: number): Promise<Post[]> {
    return prisma.post.findMany({
      where: {
        category: { equals: category, mode: 'insensitive' },
        id: { not: excludeId },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    }) as unknown as Post[];
  }
}

export class PrismaProductRepository implements IProductRepository {
  async findByCategory(category: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { category: { equals: category, mode: 'insensitive' } },
    }) as unknown as Product[];
  }

  async findAll(): Promise<Product[]> {
    return prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    }) as unknown as Product[];
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    }) as unknown as Product | null;
  }

  async create(data: any): Promise<Product> {
    return prisma.product.create({
      data,
    }) as unknown as Product;
  }

  async update(id: string, data: any): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    }) as unknown as Product;
  }

  async delete(id: string): Promise<boolean> {
    await prisma.product.delete({
      where: { id },
    });
    return true;
  }
}

export class PrismaSubscriberRepository implements ISubscriberRepository {
  async create(email: string): Promise<Subscriber> {
    return prisma.subscriber.create({
      data: { email },
    }) as unknown as Subscriber;
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    return prisma.subscriber.findUnique({
      where: { email },
    }) as unknown as Subscriber | null;
  }
}
