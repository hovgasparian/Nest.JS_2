import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Task } from 'src/tasks/tasks.entity';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  comment: string;

  @ManyToMany(() => Task, (task) => task.comments)
  @JoinTable()
  @Field(() => [Task], { nullable: true })
  tasks: Task[];
}
