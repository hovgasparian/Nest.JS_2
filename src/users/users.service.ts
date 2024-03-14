import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from './dto/create-user.input';
import { LoginResponse } from './dto/login-response';
import { Role } from 'src/roles/roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(userInput: CreateUserInput): Promise<User> {
    const hashPassword = await bcrypt.hash(userInput.password, 7);
    const user = this.usersRepository.create({
      ...userInput,
      password: hashPassword,
      role: { id: userInput.roleId },
      tasks: [],
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['tasks', 'role'],
    });
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: { id },
      relations: ['tasks', 'role'],
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async removeOne(id: number): Promise<User> {
    const userToDelete = this.usersRepository.findOneOrFail({
      where: { id },
      relations: ['tasks', 'role'],
    });
    if (!userToDelete) {
      throw new Error(`User with id: ${id} not found`);
    }
    await this.usersRepository.delete(id);
    return userToDelete;
  }

  async getUserRole(name: string): Promise<string | null> {
    const user = await this.usersRepository.findOne({
      where: { name },
    });
    if (user && user.role) {
      return user.role.roleName;
    }
    return null;
  }

  async registration(createUserInput: CreateUserInput): Promise<User> {
    const condidate = await this.usersRepository.findOne({
      where: { email: createUserInput.email },
    });
    if (condidate) {
      throw new Error(`User already exists`);
    }
    const hashPassword = await bcrypt.hash(createUserInput.password, 7);
    const user = this.usersRepository.create({
      ...createUserInput,
      password: hashPassword,
      role: { id: createUserInput.roleId },
      tasks: [],
    });
    return this.usersRepository.save(user);
  }

  async login(userInput: CreateUserInput): Promise<LoginResponse> {
    const validatedUser = await this.validateUser(
      userInput.email,
      userInput.password,
    );
    if (!validatedUser) {
      throw new Error('Invalid user');
    }

    const role = await this.getUserRole(validatedUser.name);

    const payload = { email: validatedUser.email, role: role };

    console.log(validatedUser.role);

    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user: validatedUser,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
