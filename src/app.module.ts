import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { CustomValidationPipe } from './pipes/validation-pipe-options'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { LoggerMiddleware } from './logger/logger.middleware'
import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core'
import { TransformInterceptor } from './transform/transform.interceptor'
import { CatchEverythingFilter } from './filter/catch-all.filter'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { CacheModule } from '@nestjs/cache-manager'
import { LoggerModule } from './logger/logger.module'
import * as Joi from 'joi'

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    LoggerModule,
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
      }),
      ignoreEnvFile: true,
      cache: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/')
  }
}
