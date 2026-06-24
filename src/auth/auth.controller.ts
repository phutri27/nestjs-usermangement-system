import { Controller, Post, UseGuards, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { CurrentUser } from '../users/custom-decorators/user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@CurrentUser() user): { access_token: string } {
    return this.authService.login(user)
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req): Promise<any> {
    return req.logout()
  }
}
