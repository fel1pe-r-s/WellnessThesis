import { ISubscriberRepository } from '../domain/repositories';
import { Subscriber } from '../domain/entities';

export class SubscribeNewsletterUseCase {
  constructor(private subscriberRepository: ISubscriberRepository) {}

  async execute(email: string): Promise<Subscriber> {
    const existing = await this.subscriberRepository.findByEmail(email);
    if (existing) {
      return existing;
    }
    return this.subscriberRepository.create(email);
  }
}
