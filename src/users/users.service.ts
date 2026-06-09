import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly users: CreateUserDto[] = [];

  create(createUserDto: CreateUserDto) {
    return this.users.push(createUserDto)
  }

  findAll(): CreateUserDto[] {
    return this.users
  }

  findOne(id: number): CreateUserDto | undefined {
    const user = this.users.find((user) => user.id === id)
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex(user => user.id === id)
    if (userIndex === -1){
      return null;
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto}
    return this.users[userIndex]
  }

  remove(id: number) {
    const index = this.users.findIndex(user => user.id === id)
    if (index === -1){
      return
    } 
    this.users.splice(index, 1)
  }
}
