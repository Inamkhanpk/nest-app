// import { DynamicModule, Module } from '@nestjs/common';
// import { KafkaService } from './kafka-service';
// import { KafkaConfig } from './kafka.interface';

// @Module({})
// export class KafkaModule {
//   static register(config: KafkaConfig): DynamicModule {
//     return {
//       module: KafkaModule,
//       providers: [
//         {
//           provide: KafkaService,
//           useValue: new KafkaService(),
//         },
//       ],
//       exports: [KafkaService],
//     };
//   }
// }




import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService,ConfigModule } from '@nestjs/config';

@Module({


  imports: [
    
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              // clientId: 'order-service',

              brokers: ['localhost:9092'],
            },
            consumer: {
              groupId: 'my-group',
            },
          },
        }),
        inject: [ConfigService],
      },
    ])
  ],
  exports: [ClientsModule], // export so it can be used elsewhere
})
export class KafkaModule {}