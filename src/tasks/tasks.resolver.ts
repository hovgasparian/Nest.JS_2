import {
  Resolver,
  Query,
  Args,
  Int,
  Mutation,
} from '@nestjs/graphql';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';
import { CreateTasksInput } from './dto/create-trask.input';

@Resolver(() => Task)
export class TasksResolver {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Mutation(() => Task)
  createTask(
    @Args('createTasksInput') createTasksInput: CreateTasksInput,
  ): Promise<Task> {
    const { title, description, ownerId } = createTasksInput;
    return this.tasksService.createTask(title, description, ownerId);
  }

  @Mutation(() => Task)
  deleteTask(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    return this.tasksService.removeTask(id);
  }

  @Query(() => [Task])
  async tasks(): Promise<Task[]> {
    return await this.tasksService.getAllTasks();
  }

  @Query(() => Task)
  async getOneTask(@Args('id', { type: () => Int }) id: number): Promise<Task> {
    return await this.tasksService.getOneTask(id);
  }
}
