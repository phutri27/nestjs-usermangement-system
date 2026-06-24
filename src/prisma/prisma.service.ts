import { Injectable } from '@nestjs/common'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { ConfigService } from '@nestjs/config'
import 'dotenv/config'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private configService: ConfigService) {
    const connectionString = configService.get<string>('database.url')
    const adapter = new PrismaPg({ connectionString })
    super({ adapter })
  }
}
