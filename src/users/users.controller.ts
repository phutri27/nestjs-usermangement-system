import { Controller, 
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
  ParseFilePipeBuilder } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './custom-decorators/roles.decorator.js';
import { RolesGuard } from '../guard/roles.guard.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'jpg'
      })
      .addMaxSizeValidator({
        maxSize: 2000000
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      })
  ) file: Express.Multer.File){
    return this.usersService.uploadAvatar();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.ACCEPTED)
  findAll() {
    return this.usersService.findAll();
  }

  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {  
    return this.usersService.findOne({id});
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update({
      where:{ id },
      data: updateUserDto
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove({ id });
  }
}
