import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { describe, beforeEach, expect, it, jest } from '@jest/globals'
import { Role } from '../common/user-role.enum'
import { PrismaService } from '../prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ModuleMocker, MockMetadata } from 'jest-mock'
import { UsersController } from './users.controller'

const moduleMocker = new ModuleMocker(global)

describe('UsersService', () => {
  let service: UsersService
  let prisma: PrismaService
  let controller: UsersController
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      controllers: [UsersController],
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
        if (token === CACHE_MANAGER) {
          return {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
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

    service = module.get<UsersService>(UsersService)
    controller = module.get<UsersController>(UsersController)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return all users', async () => {
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

    const { password, ...rest } = users[0]

    jest.spyOn(prisma.user, 'findMany').mockResolvedValue(users)
    expect(await service.findAll()).toEqual(users)
  })

  it('should add user', async () => {
    const user = {
      id: 1,
      email: 'triphu27@gmail.com',
      name: 'phu',
      age: 25,
      role: Role.ADMIN,
      createdAt: new Date(),
      password: 'randomstring',
    }
    const { password, ...rest } = user

    jest.spyOn(prisma.user, 'create').mockResolvedValue(user)
    expect(await service.create(user)).toEqual(rest)
  })
})
