import { PrismaPostRepository, PrismaProductRepository, PrismaSubscriberRepository } from '../../infrastructure/repositories/PrismaRepositories';
import { GetPostsUseCase, GetPostBySlugUseCase, GetPostsByCategoryUseCase, CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase, GetPostByIdUseCase, GetRelatedPostsUseCase } from './PostUseCases';
import { SubscribeNewsletterUseCase } from './NewsletterUseCases';
import { GetProductsByCategoryUseCase, GetAllProductsUseCase, GetProductByIdUseCase, CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase } from './ProductUseCases';

// Repositories
const postRepository = new PrismaPostRepository();
const productRepository = new PrismaProductRepository();
const subscriberRepository = new PrismaSubscriberRepository();

// Use Cases
export const getPostsUseCase = new GetPostsUseCase(postRepository);
export const getPostBySlugUseCase = new GetPostBySlugUseCase(postRepository);
export const getPostsByCategoryUseCase = new GetPostsByCategoryUseCase(postRepository);
export const createPostUseCase = new CreatePostUseCase(postRepository);
export const updatePostUseCase = new UpdatePostUseCase(postRepository);
export const deletePostUseCase = new DeletePostUseCase(postRepository);
export const getPostByIdUseCase = new GetPostByIdUseCase(postRepository);
export const getRelatedPostsUseCase = new GetRelatedPostsUseCase(postRepository);

export const subscribeNewsletterUseCase = new SubscribeNewsletterUseCase(subscriberRepository);

export const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(productRepository);
export const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
export const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
export const createProductUseCase = new CreateProductUseCase(productRepository);
export const updateProductUseCase = new UpdateProductUseCase(productRepository);
export const deleteProductUseCase = new DeleteProductUseCase(productRepository);
