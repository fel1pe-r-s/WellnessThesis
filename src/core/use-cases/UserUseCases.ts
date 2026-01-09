import { IUserRepository } from '../domain/repositories';
import { User } from '../domain/entities';

export class GetUserByEmailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: any): Promise<User> {
    return this.userRepository.create(data);
  }
}
