import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    name: string,
    email: string,
    password: string,
    roleId?: number,
  ): Promise<User> {
    const hashPassword = await bcrypt.hash(password, 7);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashPassword,
      role: { id: roleId },
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

  async registration(
    name: string,
    email: string,
    password: string,
    roleId?: number,
  ): Promise<User> {
    const condidate = await this.usersRepository.findOneOrFail({
      where: { email },
    });
    if (condidate) {
      throw new HttpException(`User already exist`, HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(password, 7);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashPassword,
      role: { id: roleId },
      tasks: [],
    });
    return this.usersRepository.save(user);
  }

  async login(name: string, email: string, password: string, roleId?: number) {
    const user = this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const validateUser = await this.validateUser(name, email, password, roleId);
    return {
      access_token: this.generateToken(validateUser),
      user,
    };
  }

  private async generateToken(user: User): Promise<string> {
    const payLoad = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    };
    const token = this.jwtService.sign(payLoad);
    return token;
  }

  async validateUser(
    name: string,
    email: string,
    password: string,
    roleId: number,
  ) {
    const user = await this.usersRepository.findOne({ where: { email } });
    const passwordsEqual = await bcrypt.compare(password, user.password);
    if (user && passwordsEqual) {
      return user;
    }
    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }
}
