import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UsersService } from '../users/users.service.js';
import type { Student } from '../db/schema.js';

type AuthenticatedRequest = Request & { user: Student };

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) throw new UnauthorizedException('Access token is required');

    let payload: { sub?: string };
    try {
      payload = await this.jwtService.verifyAsync<{ sub?: string }>(token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }

    if (!payload.sub) throw new UnauthorizedException('Invalid access token');

    const student = await this.usersService.findById(payload.sub);
    if (!student || !student.isVerified) {
      throw new UnauthorizedException('Student account is unavailable');
    }

    request.user = student;
    return true;
  }
}
