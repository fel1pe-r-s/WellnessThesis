import { 
  InMemoryPostRepository, 
  InMemoryProductRepository, 
  InMemorySubscriberRepository, 
  InMemoryUserRepository 
} from '../../infrastructure/repositories/in-memory';
import { 
  MySQLPostRepository 
} from '../../infrastructure/repositories/mysql/MySQLPostRepository';
import { 
  MySQLProductRepository 
} from '../../infrastructure/repositories/mysql/MySQLProductRepository';
import { 
  MySQLSubscriberRepository 
} from '../../infrastructure/repositories/mysql/MySQLSubscriberRepository';
import { 
  MySQLUserRepository 
} from '../../infrastructure/repositories/mysql/MySQLUserRepository';
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
    const useMySQL = Boolean(process.env.DB_HOST);

    if (useMySQL) {
      this.userRepository = new MySQLUserRepository();
      this.postRepository = new MySQLPostRepository();
      this.productRepository = new MySQLProductRepository();
      this.subscriberRepository = new MySQLSubscriberRepository();
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
