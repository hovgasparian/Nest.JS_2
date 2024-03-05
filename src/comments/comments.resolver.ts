import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './comments.entity';
import { CreateCommentsInput } from './dto/create-comment.input';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private commentsService: CommentsService) {}

  @Query(() => [Comment])
  comments(): Promise<Comment[]> {
    return this.commentsService.getAllComments();
  }

  @Query(() => Comment)
  comment(@Args('id', { type: () => Int }) id: number): Promise<Comment> {
    return this.commentsService.getOneComment(id);
  }

  @Mutation(() => Comment)
  addComment(
    @Args('createCommentsInput') createCommentsInput: CreateCommentsInput,
  ): Promise<Comment> {
    return this.commentsService.addNewComment(createCommentsInput);
  }
}
