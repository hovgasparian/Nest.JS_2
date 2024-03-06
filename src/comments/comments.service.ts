import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async getAllComments(): Promise<Comment[]> {
    return this.commentsRepository.find({ relations: ['tasks'] });
  }

  async getOneComment(id: number): Promise<Comment> {
    return this.commentsRepository.findOneOrFail({
      where: { id },
      relations: ['tasks'],
    });
  }

  async addNewComment(comment: string): Promise<Comment> {
    const comments = this.commentsRepository.create({ comment, tasks: [] });
    return this.commentsRepository.save(comments);
  }
}
