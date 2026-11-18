import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module.js';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard.js';
import { AuthModule } from './auth/auth.module.js';
@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal:true,
      expandVariables:true
     }),
     UsersModule, JwtModule.register({ global:true}),AuthModule
  ],
  // controllers: [],
  providers: [
    {provide:  APP_GUARD,  useClass:JwtAuthGuard  }
  ],
})
export class AppModule {}
