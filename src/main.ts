import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata'; // Need to check this (typeorm tutorial)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
