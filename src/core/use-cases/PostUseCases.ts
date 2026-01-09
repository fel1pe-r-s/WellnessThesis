import { IPostRepository } from '../domain/repositories';
import { Post } from '../domain/entities';

export class GetPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(): Promise<Post[]> {
    return this.postRepository.findAll();
  }
}

export class GetPostBySlugUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(slug: string): Promise<Post | null> {
    return this.postRepository.findBySlug(slug);
  }
}

export class GetRelatedPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(category: string, excludeId: string, limit: number = 3): Promise<Post[]> {
    return this.postRepository.findRelated(category, excludeId, limit);
  }
}

export class GetPostsByCategoryUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(category: string): Promise<Post[]> {
    return this.postRepository.findByCategory(category);
  }
}

export class CreatePostUseCase {
    constructor(private postRepository: IPostRepository) {}
    async execute(data: any): Promise<Post> {
        return this.postRepository.create(data);
    }
}

export class UpdatePostUseCase {
    constructor(private postRepository: IPostRepository) {}
    async execute(id: string, data: any): Promise<Post> {
        return this.postRepository.update(id, data);
    }
}

export class DeletePostUseCase {
    constructor(private postRepository: IPostRepository) {}
    async execute(id: string): Promise<boolean> {
        return this.postRepository.delete(id);
    }
}

export class GetPostByIdUseCase {
    constructor(private postRepository: IPostRepository) {}
    async execute(id: string): Promise<Post | null> {
        return this.postRepository.findById(id);
    }
}

export class GetCategoriesUseCase {
  constructor(private postRepository: IPostRepository) {}
  async execute(): Promise<string[]> {
    return this.postRepository.getCategories();
  }
}

export class SearchPostsUseCase {
  constructor(private postRepository: IPostRepository) {}
  async execute(query: string): Promise<Post[]> {
    return this.postRepository.search(query);
  }
}
