import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentsInput {
  @Field()
  comment: string;
}
