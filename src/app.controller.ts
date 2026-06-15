import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/local-auth.guard.js'
import { AuthService } from './auth/auth.service.js'
import { JwtAuthGuard } from './auth/jwt-auth.guard.js'
import { CurrentUser } from './users/custom-decorators/user.decorator.js'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@CurrentUser() user): Promise<{ access_token: string }> {
    return this.authService.login(user)
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  logout(@Request() req): Promise<any> {
    return req.logout()
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user): Promise<any> {
    return user
  }

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
