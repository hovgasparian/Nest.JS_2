import { Field, InputType, Int } from '@nestjs/graphql';
// import { CreateCommentsInput } from 'src/comments/dto/create-comment.input';
// import { User } from 'src/users/users.entity';

@InputType()
export class CreateTasksInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Int, { nullable: true })
  ownerId: number;
}
