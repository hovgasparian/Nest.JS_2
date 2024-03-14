import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/users.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field({ nullable: true })
  roleName: string;

  @OneToMany(() => User, (user) => user.role)
  @Field(() => [User], { nullable: true })
  users: User[];
}
