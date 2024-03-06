import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create(name: string, email: string, roleId: number): Promise<User> {
    const user = this.usersRepository.create({
      name,
      email,
      role: { id: roleId },
      tasks: [],
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['tasks', "role"],
    });
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: { id },
      relations: ['tasks', "role"],
    });
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
}
