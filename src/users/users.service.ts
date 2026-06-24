import { Inject, Injectable, Logger, UseInterceptors } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User, Prisma } from '../generated/prisma/client'
import bcrypt from 'bcrypt'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { CacheInterceptor } from '@nestjs/cache-manager'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name, { timestamp: true })
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const { password, ...user } = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    })

    return user
  }

  @UseInterceptors(CacheInterceptor)
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
      },
    })
    return users
  }

  findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, 'password'> | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      omit: {
        password: true,
      },
    })
  }

  uploadAvatar() {}

  update(datas: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = datas
    return this.prisma.user.update({
      where,
      data,
    })
  }

  remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  }
}
