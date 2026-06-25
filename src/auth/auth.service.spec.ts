import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { describe, beforeEach, it, expect, jest } from '@jest/globals'
import { ModuleMocker, MockMetadata } from 'jest-mock'
import { AuthController } from './auth.controller'
import bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { Role } from '../common/user-role.enum'
import { JwtService } from '@nestjs/jwt'

const moduleMocker = new ModuleMocker(global)

describe('AuthService', () => {
  const email = 'triphu27@gmail.com'
  const pass = 'randompass'

  let service: AuthService
  let controller: AuthController
  let prismaService: PrismaService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          }
        }
        if (token == JwtService) {
          return {
            sign: jest.fn(),
          }
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockMetadata<
            any,
            any
          >
          const Mock = moduleMocker.generateFromMetadata(
            mockMetadata,
          ) as ObjectConstructor
          return new Mock()
        }
      })
      .compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
    controller = module.get<AuthController>(AuthController)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
    expect(controller).toBeDefined()
  })

  it('validateUser should return logged in user', async () => {
    const user = {
      id: 1,
      email: 'triphu27@gmail.com',
      name: 'phu',
      age: 25,
      role: Role.ADMIN,
      createdAt: new Date(),
      password: 'randompass',
    }

    const { password, ...rest } = user
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user)
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)

    expect(await service.validateUser(email, pass)).toEqual(rest)
  })

  it('validateUser return null', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null)

    expect(await service.validateUser(email, pass)).toBe(null)
  })

  it('login return token', () => {
    jest.spyOn(jwtService, 'sign').mockReturnValue('jwtrandomtoken')
    expect(
      service.login({ email: 'phu27@gmail.com', sub: 1, role: Role.ADMIN }),
    ).toEqual({
      access_token: 'jwtrandomtoken',
    })
  })
})
