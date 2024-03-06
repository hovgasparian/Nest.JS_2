import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';
import { CreateRolesInput } from './dto/create-role.input';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private rolesService: RolesService) {}

  @Query(() => [Role])
  async roles(): Promise<Role[]> {
    return await this.rolesService.getAllRoles();
  }

  @Query(() => Role)
  async role(@Args('id', { type: () => Int }) id: number): Promise<Role> {
    return this.rolesService.getOneRole(id);
  }

  @Mutation(() => Role)
  async removeRole(@Args('id', { type: () => Int }) id: number): Promise<Role> {
    return this.rolesService.deleteRole(id);
  }

  @Mutation(() => Role)
  async createRole(
    @Args('createRolesInput') createRolesInput: CreateRolesInput,
  ): Promise<Role> {
    const { roleName } = createRolesInput;
    return this.rolesService.createRole(roleName);
  }
}
