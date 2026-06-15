import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { GuardModule } from '../guard/guard.module'
import { MulterModule } from '@nestjs/platform-express'
import { MulterConfigService } from '../multer/multer.config'

@Module({
  imports: [
    GuardModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
