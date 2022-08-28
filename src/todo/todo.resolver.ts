import { Args, Field, ID, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { GraphqlJwtGuard, MeId } from '../auth';
import { TodoItem as TodoEntity } from '../entity';
import { TodoService } from './todo.service';

@ObjectType()
export class TodoItem {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  completed!: boolean;
}

@Resolver(() => TodoItem)
export class TodoResolver {
  constructor(private todoService: TodoService) {}

  private convert(item: TodoEntity): TodoItem {
    return {
      id: item.id.toString(),
      title: item.title,
      completed: !!item.completedAt
    };
  }

  @Query(() => [TodoItem])
  @UseGuards(GraphqlJwtGuard)
  async listTodos(
    @MeId() meId: number,
    @Args('completed', { nullable: true }) completed?: boolean
  ): Promise<TodoItem[]> {
    const items = await this.todoService.find(meId, completed);

    return items.map(this.convert.bind(this));
  }

  @Mutation(() => TodoItem)
  @UseGuards(GraphqlJwtGuard)
  async createTodo(
    @MeId() meId: number,
    @Args('title') title: string,
    @Args('completed', { nullable: true }) completed: boolean
  ): Promise<TodoItem> {
    console.log({ meId });
    return this.todoService.create(meId, { title, completed }).then(this.convert.bind(this));
  }

  @Mutation(() => TodoItem)
  @UseGuards(GraphqlJwtGuard)
  async updateTodo(
    @MeId() meId: number,
    @Args('id', { type: () => ID }) id: string,
    @Args('title', { nullable: true }) title?: string,
    @Args('completed', { nullable: true }) completed?: boolean
  ): Promise<TodoItem> {
    return this.todoService.update(meId, { id: +id, title, completed }).then(this.convert.bind(this));
  }

  @Mutation(() => Boolean)
  @UseGuards(GraphqlJwtGuard)
  async deleteTodo(@MeId() meId: number, @Args('id', { type: () => ID }) id: string): Promise<boolean> {
    await this.todoService.delete(meId, +id);
    return true;
  }
}
