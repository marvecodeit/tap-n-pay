import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { TerminalProfileController } from './terminal-profile.controller.js';
import { TerminalApiKeyGuard } from './terminal-api-key.guard.js';
import { CloudinaryService } from '../auth/cloudinary.service.js';

@Module({
  controllers: [UsersController, TerminalProfileController],
  providers: [UsersService, TerminalApiKeyGuard, CloudinaryService],
  exports: [UsersService],
})
export class UsersModule {}
