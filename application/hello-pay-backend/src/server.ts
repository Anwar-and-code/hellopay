import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { HttpExceptionFilter } from './utils/http-exception.filter';
declare const module: any;
import { ValidationPipe } from '@nestjs/common';

// import 'dotenv/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              
    forbidNonWhitelisted: true,    
    transform: true,               
    transformOptions: { enableImplicitConversion: true },
  }));
  await app.listen(4000);
}
bootstrap();
