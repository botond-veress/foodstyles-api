import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TodoItem } from '../entity';

interface CreateTodoOptions {
  title: string;
  completed?: boolean;
}

interface UpdateTodoOptions extends Partial<CreateTodoOptions> {
  id: number;
}

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoItem)
    private todoRepository: Repository<TodoItem>
  ) {}

  async create(userId: number, { title, completed }: CreateTodoOptions) {
    return this.todoRepository.save(
      this.todoRepository.create({
        userId,
        title,
        ...this.getCompleted(completed)
      })
    );
  }

  async update(userId: number, { id, title, completed }: UpdateTodoOptions) {
    await this.todoRepository.update({ id, userId }, { title, ...this.getCompleted(completed) });

    const item = await this.get(userId, id);

    if (!item) throw new NotFoundException();

    return item;
  }

  async delete(userId: number, id: number) {
    const { affected } = await this.todoRepository.softDelete({ id, userId });

    if (affected !== 1) throw new NotFoundException();
  }

  async get(userId: number, id: number) {
    return this.todoRepository.findOneBy({ id, userId });
  }

  async find(userId: number, completed?: boolean) {
    return (
      this.todoRepository
        .createQueryBuilder('t')
        .where({
          userId,
          ...this.getCompleted(completed)
        })
        // Not completed items first
        .orderBy('t.completedAt IS NOT NULL')
        // Most recently completed at top
        .addOrderBy('t.completedAt', 'DESC')
        // Most recently created at top
        .addOrderBy('t.createdAt', 'DESC')
        .getMany()
    );
  }

  private getCompleted(completed?: boolean) {
    if (completed == undefined) return {};

    return { completedAt: completed ? new Date() : undefined };
  }
}
