import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Task } from 'src/tasks/tasks.entity';
import { RolesModule } from 'src/roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt-strategy';
import { RolesGuard } from 'src/auth/roles-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Task]),
    forwardRef(() => RolesModule),
    JwtModule.register({
      signOptions: { expiresIn: '24h' },
      secret: 'hide-me',
    }),
  ],
  providers: [UsersService, UsersResolver, JwtStrategy, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
