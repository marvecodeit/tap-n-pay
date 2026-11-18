import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import {SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js'
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin:
      configService
        .get<string>('CORS_ORIGINS')
        ?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean) ?? ['http://localhost:5180'],
    credentials: true,
  });

  app.setGlobalPrefix("/api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  )
  app.useGlobalFilters(new HttpExceptionFilter());

  // const config = new DocumentBuilder() 
  // .setTitle("Tap-N-Pay Api") .setDescription("") .setVersion("v1.0") .addBearerAuth() .build()

  // const document = SwaggerModule
  
  await app.listen(process.env.PORT ?? 3000);   //main Port Url enable later still on testing
  // await app.listen(4000, "0.0.0.0");   //main Port Url enable later still on testing



}
await bootstrap();
