import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Users management system')
    .setDescription('APIs for user mangement system')
    .setVersion('1.0')
    .addTag('users')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, documentFactory)

  const configService = app.get(ConfigService)
  const port = configService.get('port')
  await app.listen(port ?? 3000)
  return
}
bootstrap()
