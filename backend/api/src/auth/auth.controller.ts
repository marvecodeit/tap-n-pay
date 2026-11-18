import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CurrentUser } from '../common/filters/decorator/current-user.decorator.js';
import { Public } from '../common/filters/decorator/public-decorator.js';
import type { Student } from '../db/schema.js';
import { loginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { emit } from 'process';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() dto: loginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @Public()
  @Get('verify-email')
  verifyEmail(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verifyEmail(token, res);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req.cookies?.refresh_token ?? '', res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @CurrentUser() currentUser: Student,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(currentUser.id, res);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({summary:"Get Current Authenticated User"})
  me(@CurrentUser() student:Student) {
    return {
      id:student.id,
      email:student.email,
      fullname:student.fullname,
      matric_id:student.matric_id,
      level:student.level
    }
  }
}

