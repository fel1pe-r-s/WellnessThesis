import { 
  InMemoryPostRepository, 
  InMemoryProductRepository, 
  InMemorySubscriberRepository, 
  InMemoryUserRepository 
} from '../../infrastructure/repositories/in-memory';
import { PostgresUserRepository } from '../../infrastructure/repositories/postgres/PostgresUserRepository';
import { PostgresPostRepository } from '../../infrastructure/repositories/postgres/PostgresPostRepository';
import { PostgresProductRepository } from '../../infrastructure/repositories/postgres/PostgresProductRepository';
import { PostgresSubscriberRepository } from '../../infrastructure/repositories/postgres/PostgresSubscriberRepository';
import { 
  IPostRepository, 
  IProductRepository, 
  ISubscriberRepository, 
  IUserRepository 
} from './repositories';

class RepositoryProvider {
  private static instance: RepositoryProvider;
  
  public userRepository: IUserRepository;
  public postRepository: IPostRepository;
  public productRepository: IProductRepository;
  public subscriberRepository: ISubscriberRepository;

  private constructor() {
    // We default to Postgres now, fallback to InMemory if no connection string (usually)
    // But for simplicity, let's assume if DATABASE_URL is present, use Postgres.
    const usePostgres = Boolean(process.env.DATABASE_URL);

    if (usePostgres) {
      this.userRepository = new PostgresUserRepository();
      this.postRepository = new PostgresPostRepository();
      this.productRepository = new PostgresProductRepository();
      this.subscriberRepository = new PostgresSubscriberRepository();
    } else {
      this.userRepository = new InMemoryUserRepository();
      this.postRepository = new InMemoryPostRepository();
      this.productRepository = new InMemoryProductRepository();
      this.subscriberRepository = new InMemorySubscriberRepository();
    }
  }

  public static getInstance(): RepositoryProvider {
    if (!RepositoryProvider.instance) {
      RepositoryProvider.instance = new RepositoryProvider();
    }
    return RepositoryProvider.instance;
  }
}

export const repositories = RepositoryProvider.getInstance();
