import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth';
import { TodoItem } from '../entity';

import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([TodoItem]), AuthModule],
  providers: [TodoService, TodoResolver],
  exports: [TodoService]
})
export class TodoModule {}
