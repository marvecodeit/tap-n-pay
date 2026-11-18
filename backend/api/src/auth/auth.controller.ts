import {
  Body,
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CurrentUser } from '../common/filters/decorator/current-user.decorator.js';
import { Public } from '../common/filters/decorator/public-decorator.js';
import type { Student } from '../db/schema.js';
import { loginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AccessTokenGuard } from './access-token.guard.js';
import type { ProfileImageUpload } from './cloudinary.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
          callback(
            new BadRequestException('Upload a JPEG, PNG, or WebP profile image.'),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  register(
    @Body() dto: RegisterDto,
    @UploadedFile() profileImage?: ProfileImageUpload,
  ) {
    if (!profileImage) {
      throw new BadRequestException('A profile image is required to register.');
    }
    return this.authService.register(dto, profileImage);
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

  @UseGuards(AccessTokenGuard)
  @Get('wallet')
  wallet(@CurrentUser() currentUser: Student) {
    return this.authService.getStudentWallet(currentUser.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Current Authenticated User' })
  me(@CurrentUser() currentUser: Student) {
    return {
      id: currentUser.id,
      student_id: currentUser.matric_id,
      matric_id: currentUser.matric_id,
      name: currentUser.fullname,
      fullname: currentUser.fullname,
      email: currentUser.email,
      phone: currentUser.phonenumber,
      created_at: currentUser.createdAt,
      department: currentUser.department,
      faculty: currentUser.faculty,
      level: currentUser.level,
      profile_image_url: this.authService.getProfileImageUrl(currentUser),
      is_profile_complete: this.authService.isProfileComplete(currentUser),
    };
  }

  @UseGuards(AccessTokenGuard)
  @Post('profile-image')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
          callback(
            new BadRequestException('Upload a JPEG, PNG, or WebP profile image.'),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  uploadProfileImage(
    @CurrentUser() currentUser: Student,
    @UploadedFile() profileImage?: ProfileImageUpload,
  ) {
    if (!profileImage) {
      throw new BadRequestException('A profile image is required.');
    }
    return this.authService.uploadProfileImage(currentUser.id, profileImage);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @CurrentUser() currentUser: Student,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(currentUser.id, res);
  }
}

