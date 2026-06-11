import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GuardModule } from '../guard/guard.module.js';

@Module({
  imports: [GuardModule],
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
  exports: [UsersService]
})
export class UsersModule {}
