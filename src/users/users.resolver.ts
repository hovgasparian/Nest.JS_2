import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LoginResponse } from './dto/login-response';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  getOneUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Query(() => User)
  findByEmail(@Args('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') userInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(userInput);
  }

  @Mutation(() => User)
  deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.removeOne(id);
  }

  @Mutation(() => User)
  signUp(@Args('regInput') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.registration(createUserInput);
  }

  @Mutation(() => LoginResponse)
  login(
    @Args('loginInput') createUserInput: CreateUserInput,
  ): Promise<LoginResponse> {
    return this.usersService.login(createUserInput);
  }
}
