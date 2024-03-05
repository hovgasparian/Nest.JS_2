import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  async createTask(
    title: string,
    description: string,
    ownerId: number,
  ): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      owner: {
        id: ownerId,
      },
    });
    return this.tasksRepository.save(task);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async getOneTask(id: number): Promise<Task> {
    return this.tasksRepository.findOneOrFail({ where: { id } });
  }

  async removeTask(id: number): Promise<Task> {
    const taskToRemove = this.tasksRepository.findOne({ where: { id } });
    if (!taskToRemove) {
      throw new Error(`Task with id: ${id} not found`);
    }
    await this.tasksRepository.delete(id);
    return taskToRemove;
  }
}
