import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // HTTP API Gateway
  await app.listen(3000);
  
  // Microservice for direct service-to-service communication
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 3001 }
  });
  
  await app.startAllMicroservices();
  console.log(`API Gateway is running on HTTP:3000 and TCP:3001`);
}
bootstrap();
