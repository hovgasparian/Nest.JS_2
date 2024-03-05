import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/tasks.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  create(name: string, email: string): Promise<User> {
    const user = this.usersRepository.create({ name, email, tasks: [] });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['tasks'],
    });
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: { id },
      relations: ['tasks'],
    });
  }

  async removeOne(id: number): Promise<User> {
    const userToDelete = this.usersRepository.findOneOrFail({
      where: { id },
      relations: ['tasks'],
    });
    if (!userToDelete) {
      throw new Error(`User with id: ${id} not found`);
    }
    await this.usersRepository.delete(id);
    return userToDelete;
  }
}
