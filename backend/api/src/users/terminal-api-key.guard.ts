import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';

@Injectable()
export class TerminalApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expectedKey = this.configService.get<string>('TERMINAL_API_KEY');
    const providedKey = request.headers['x-terminal-api-key'];

    if (typeof providedKey === 'string' && expectedKey) {
      const expectedBuffer = Buffer.from(expectedKey);
      const providedBuffer = Buffer.from(providedKey);
      if (
        expectedBuffer.length === providedBuffer.length &&
        timingSafeEqual(expectedBuffer, providedBuffer)
      ) {
        return true;
      }
    }

    if (!providedKey && this.isLocalDevelopmentRequest(request)) {
      return true;
    }

    if (!expectedKey) {
      throw new ServiceUnavailableException(
        'Terminal profile lookup is not configured.',
      );
    }
    if (typeof providedKey !== 'string') {
      throw new UnauthorizedException('Terminal authorization is required.');
    }
    throw new UnauthorizedException('Terminal authorization failed.');
  }

  private isLocalDevelopmentRequest(request: Request): boolean {
    const remoteAddress = request.socket.remoteAddress;
    const isLoopback =
      remoteAddress === '127.0.0.1' ||
      remoteAddress === '::1' ||
      remoteAddress === '::ffff:127.0.0.1';
    const isTerminalOrigin =
      request.headers.origin === 'http://localhost:5174' ||
      request.headers.origin === 'http://127.0.0.1:5174';

    return (
      isLoopback &&
      isTerminalOrigin &&
      this.configService.get<string>('NODE_ENV') !== 'production' &&
      this.configService.get<string>('TERMINAL_LOCALHOST_DEV_ACCESS') ===
        'true'
    );
  }
}
