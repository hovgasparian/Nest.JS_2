import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), UsersModule],
  providers: [TasksService, TasksResolver],
  exports: [TasksService]
})
export class TasksModule {}
