import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module.js';
import { AccessTokenGuard } from './access-token.guard.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { EmailService } from './email.service.js';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService, AccessTokenGuard],
})
export class AuthModule {}
