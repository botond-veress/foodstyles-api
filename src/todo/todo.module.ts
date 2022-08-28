import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodoItem } from '../entity';

import { TodoService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem])],
  providers: [TodoService],
  exports: [TodoService]
})
export class TodoModule {}
