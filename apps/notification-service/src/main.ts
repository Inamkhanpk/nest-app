import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  Logger.log('Notification Service is running');
}
bootstrap();