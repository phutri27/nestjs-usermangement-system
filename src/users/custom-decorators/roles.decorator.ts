import { Reflector } from '@nestjs/core'
import { Role } from '../../common/user-role.enum'

export const Roles = Reflector.createDecorator<Role[]>()
