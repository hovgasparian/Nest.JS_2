import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateTasksInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Int, { nullable: true })
  ownerId: number;

  @Field(() => Int, {nullable: true})
  commentsId: number
}
