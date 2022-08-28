import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.createQueryBuilder('u').addSelect(['u.hashedPassword']).where({ email }).getOne();
  }

  async findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return await this.userRepository.save(user);
  }
}
