import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { it, describe, beforeAll, jest, expect } from '@jest/globals'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'
import { Role } from '../src/common/user-role.enum'
import { JwtService } from '@nestjs/jwt'

describe('App testing e2e', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwtService: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      })
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()

    prisma = moduleRef.get<PrismaService>(PrismaService)
    jwtService = moduleRef.get<JwtService>(JwtService)
  })

  it('/GET users', () => {
    const users = [
      {
        id: 1,
        email: 'triphu27@gmail.com',
        name: 'phu',
        age: 25,
        role: Role.ADMIN,
        createdAt: new Date(),
        password: 'dsadaacc',
      },
    ]

    const token = jwtService.sign({ id: 1, email: 'test@gmail.com' })

    jest.spyOn(prisma.user, 'findMany').mockResolvedValue(users)

    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect((res) => {
        expect(res.body).toEqual({
          data: users.map((u) => ({
            ...u,
            createdAt: u.createdAt.toISOString(),
          })),
          meta: { statusCode: 202 },
        })
      })
  })
})
