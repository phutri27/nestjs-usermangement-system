import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Patch,
  Param,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Roles } from './custom-decorators/roles.decorator'
import { RolesGuard } from '../guard/roles.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload avatar' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Avatar uploaded' })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .addMaxSizeValidator({
          maxSize: 2000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar()
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Find all users' })
  @HttpCode(HttpStatus.ACCEPTED)
  findAll() {
    return this.usersService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Find specific user based on id' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Find specfic user',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne({ id })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Patch(':id')
  @ApiOperation({ summary: 'Admin update user' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Admin update user successfully',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update({
      where: { id },
      data: updateUserDto,
    })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  @ApiOperation({ summary: 'Admin delete user' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Admin delete user successfully',
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove({ id })
  }
}
