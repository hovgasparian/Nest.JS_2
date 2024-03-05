import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/users.entity';
import { Comment } from 'src/comments/comments.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Task {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn()
  @Field(() => User)
  owner: User;


  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];
}
