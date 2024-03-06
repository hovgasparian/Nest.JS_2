import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => UsersModule)],
  providers: [RolesService, RolesResolver],
  exports: [RolesService],
})
export class RolesModule {}
