import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Task } from 'src/tasks/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService]
})
export class UsersModule {}
