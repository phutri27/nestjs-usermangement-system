import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { CurrentUser } from './users/custom-decorators/user.decorator'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@CurrentUser() user): { access_token: string } {
    return this.authService.login(user)
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  logout(@Request() req): Promise<any> {
    return req.logout()
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user): any {
    return user
  }

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
