import { Module, NestModule, MiddlewareConsumer, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './logger/logger.middleware.js';
import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';
import { TransformInterceptor } from './transform/transform.interceptor.js';
import { CatchEverythingFilter } from './filter/catch-all.filter.js';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration.js';
import * as Joi from 'joi';

@Module({
  imports: [UsersModule, 
    PrismaModule, 
    AuthModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required()
      }),
      validatePredefined: false,
      cache: true
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter
    }
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(LoggerMiddleware)
        .forRoutes("/")
  }
}
