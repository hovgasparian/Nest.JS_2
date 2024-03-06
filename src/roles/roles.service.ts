import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  async getAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ['users'] });
  }

  async getOneRole(id: number): Promise<Role> {
    return this.rolesRepository.findOneOrFail({
      where: { id },
      relations: ['users'],
    });
  }

  async deleteRole(id: number): Promise<Role> {
    const roleToRemove = this.rolesRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!roleToRemove) {
      throw new Error(`Role with id: ${id} not found`);
    }
    await this.rolesRepository.delete(id);
    return roleToRemove;
  }

  async createRole(roleName: string): Promise<Role> {
    const role = this.rolesRepository.create({
        roleName,
        users: []
    })
    return this.rolesRepository.save(role)
  }
}
