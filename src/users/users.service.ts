import { Inject, Injectable, Logger, UseInterceptors } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { User, Prisma } from '../generated/prisma/client'
import bcrypt from 'bcrypt'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Cache } from 'cache-manager'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { UpdateUserDto } from './dto/update-user.dto'

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

  async update(datas: {
    where: Prisma.UserWhereUniqueInput
    data: UpdateUserDto
  }): Promise<User> {
    const { data, where } = datas
    const { password, ...rest } = data

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined

    return this.prisma.user.update({
      where,
      data: {
        ...rest,
        ...(hashedPassword && { password: hashedPassword }),
      },
    })
  }

  remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  }
}
