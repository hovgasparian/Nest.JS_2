import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserInput } from './dto/create-user.input';
import { LoginResponse } from './dto/login-response';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/role-auth.decorator';
import { RolesGuard } from 'src/auth/roles-auth.guard';


@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @Roles("Admin")
  @UseGuards(RolesGuard)
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
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const { name, email, password, roleId } = createUserInput;
    return this.usersService.create(name, email, password, roleId);
  }

  @Mutation(() => User)
  deleteUser(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.removeOne(id);
  }

  @Mutation(() => User)
  signUp(@Args('regInput') createUserInput: CreateUserInput): Promise<User> {
    const { name, email, password, roleId } = createUserInput;
    return this.usersService.create(name, email, password, roleId);
  }

  @Mutation(() => LoginResponse)
  login(@Args('loginInput') createUserInput: CreateUserInput): Promise<any> {
    const { name, email, password, roleId } = createUserInput;
    return this.usersService.login(name, email, password, roleId);
  }
}
