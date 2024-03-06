import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from 'src/roles/roles.entity';
import { Task } from 'src/tasks/tasks.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @OneToMany(() => Task, (task) => task.owner)
  @Field(() => [Task])
  tasks: Task[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn()
  @Field(() => Role, {nullable: true})
  role: Role;
}
