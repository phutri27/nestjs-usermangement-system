import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { User, Prisma } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const {password, ...user} = await this.prisma.user.create({
      data:{
        ...data,
        password: hashedPassword
      }
    })

    return user
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput
    })
  }

  update(datas: {where: Prisma.UserWhereUniqueInput; data: Prisma.UserUpdateInput}): Promise<User> {
    const { where, data } = datas
    return this.prisma.user.update({
      where,
      data
    })
  }

  remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where
    })
  }
}
