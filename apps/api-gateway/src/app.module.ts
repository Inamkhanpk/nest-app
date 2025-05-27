import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  
    ConfigModule.forRoot({
      isGlobal: true, // so it's available across all modules
   
    }),
    
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002 }
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3003 }
      },
    ]),
    
  ],
  providers: [
   
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // apply globally
    },
  ],
  controllers: [AppController],
})
export class AppModule {}