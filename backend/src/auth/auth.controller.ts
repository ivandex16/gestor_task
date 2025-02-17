import {
  Body,
  Controller,
  Header,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser } from './decorator';
import { IncomingHttpHeaders } from 'http';
//import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const response = await this.userService.login(loginUserDto);
    console.log('responseLogin', response);
    return response;
  }

  // @Post('logout')
  // async logout(@Body() userId: string) {
  //     return this.userService.logout(userId);
  // }
}
