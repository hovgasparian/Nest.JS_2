import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { CreateCommentsInput } from './dto/create-comment.input';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async getAllComments(): Promise<Comment[]> {
    return this.commentsRepository.find();
  }

  async getOneComment(id: number): Promise<Comment> {
    return this.commentsRepository.findOneOrFail({ where: { id } });
  }

  async addNewComment(
    createCommentsInput: CreateCommentsInput,
  ): Promise<Comment> {
    const comment = this.commentsRepository.create(createCommentsInput);
    return this.commentsRepository.save(comment);
  }
}
