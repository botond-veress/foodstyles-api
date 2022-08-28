import { Args, Field, ID, Mutation, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';

import { UserService } from '../user';

import { AuthService } from './auth.service';
import { MeId } from './decorator';
import { GraphqlJwtGuard } from './guard';
import { EmailScalar, PasswordScalar } from './scalar';

@ObjectType()
export class AuthToken {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;
}

@ObjectType()
export class Me {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;
}

@Resolver(() => Me)
export class AuthResolver {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Query(() => Me)
  @UseGuards(GraphqlJwtGuard)
  async me(@MeId() meId: number): Promise<Me> {
    const user = await this.userService.findById(meId);

    if (!user) throw new NotFoundException();

    return { id: user.id.toString(), email: user.email, name: user.name };
  }

  @Mutation(() => AuthToken)
  async login(
    @Args('email', { type: () => EmailScalar }) email: string,
    @Args('password', { type: () => PasswordScalar }) password: string
  ): Promise<AuthToken> {
    console.log({ email, password });
    return this.authService.login({ email, password });
  }

  @Mutation(() => AuthToken)
  async signUp(
    @Args('name') name: string,
    @Args('email', { type: () => EmailScalar }) email: string,
    @Args('password') password: string
  ): Promise<AuthToken> {
    return this.authService.signUp({ name, email, password });
  }

  @Mutation(() => AuthToken)
  async refreshAccessToken(@Args('refreshToken') refreshToken: string): Promise<AuthToken> {
    return this.authService.renewToken(refreshToken);
  }
}
